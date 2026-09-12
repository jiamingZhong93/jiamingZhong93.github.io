'use strict';

// Local renderer for this homepage; it never invokes Git or a deployment service.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '_site', 'public');
const args = process.argv.slice(2);
const buildOnly = args.includes('--build');
const portArg = args.find(arg => arg.startsWith('--port='));
const requestedPort = portArg ? Number(portArg.slice(7)) : 4000;
if (args.some(arg => arg !== '--build' && !arg.startsWith('--port=')) ||
    !Number.isInteger(requestedPort) || requestedPort < 0 || requestedPort > 65535) {
  console.error('Usage: preview [--build] [--port=4000]');
  process.exit(1);
}
const [major, minor] = process.versions.node.split('.').map(Number);
if (!(major > 20 || (major === 20 && minor >= 19))) {
  console.error('This preview requires Node.js 20.19 or newer.');
  process.exit(1);
}

function ensureDependencies() {
  const lock = fs.readFileSync(path.join(root, 'package-lock.json'));
  const hash = crypto.createHash('sha256').update(lock).digest('hex');
  const marker = path.join(root, 'node_modules', '.homepage-preview-lock');
  const installed = fs.existsSync(marker) && fs.readFileSync(marker, 'utf8') === hash;
  const packages = ['liquidjs', 'markdown-it', 'sass', 'yaml'];
  if (installed && packages.every(name => fs.existsSync(path.join(root, 'node_modules', name)))) return;
  console.log('Installing locked preview dependencies in this folder (first run needs internet)...');
  const npmArgs = ['ci', '--ignore-scripts', '--no-audit', '--no-fund'];
  const env = { ...process.env, PATH: path.dirname(process.execPath) + path.delimiter + process.env.PATH };
  let result;
  if (process.platform === 'win32') {
    // npm.cmd may force its adjacent, older node.exe; invoke its CLI with our validated runtime.
    const found = spawnSync('where.exe', ['npm.cmd'], { env, encoding: 'utf8' });
    const launchers = (found.stdout || '').trim().split(/\r?\n/).filter(Boolean);
    const candidates = [process.env.npm_execpath, ...launchers.map(file => path.join(path.dirname(file), 'node_modules', 'npm', 'bin', 'npm-cli.js'))];
    const npmCli = candidates.find(file => file && fs.existsSync(file));
    if (!npmCli) throw new Error('npm was not found. Install Node.js with npm, then run the launcher again.');
    result = spawnSync(process.execPath, [npmCli, ...npmArgs], { cwd: root, env, stdio: 'inherit' });
  } else {
    result = spawnSync('npm', npmArgs, { cwd: root, env, stdio: 'inherit' });
  }
  if (result.error || result.status !== 0) {
    throw new Error('Could not install dependencies. Install Node.js 20.19+ with npm, check your network, then run the launcher again.');
  }
  fs.writeFileSync(marker, hash);
}

async function main() {
  ensureDependencies();
  const { Liquid } = require('liquidjs');
  const MarkdownIt = require('markdown-it');
  const YAML = require('yaml');
  const sass = require('sass');
  const read = name => fs.readFileSync(path.join(root, name), 'utf8');
  function frontmatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)^---\r?\n/m);
    return { data: match ? YAML.parse(match[1]) || {} : {}, body: match ? text.slice(match[0].length) : text };
  }
  function includes(text) {
    return text.replace(/{%\s*include\s+([\w./-]+)\s*%}/g, (_, file) => includes(read('_includes/' + file)));
  }
  const markdown = new MarkdownIt({ html: true, typographer: true });
  markdown.renderer.rules.heading_open = (tokens, i) => '<' + tokens[i].tag + ' id="' +
    tokens[i + 1].content.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-') + '">';
  const liquid = new Liquid({ strictFilters: true });
  liquid.registerFilter('markdownify', value => markdown.render(String(value || '')));
  liquid.registerFilter('jsonify', JSON.stringify);
  let localUrl = '';
  let revision = 0;
  let lastError = '';

  const reloadScript = '<script>(() => { let revision = null; setInterval(async () => { try {' +
    'const state = await (await fetch("/__preview_status", {cache:"no-store"})).json();' +
    'if (state.error) console.error("Preview build:", state.error);' +
    'if (revision !== null && revision !== state.revision) location.reload();' +
    'revision = state.revision;' +
    '} catch {} }, 1000); })();</script>';

  async function build() {
    const site = YAML.parse(read('_config.yml'));
    // Canonical URLs and template-generated navigation stay on the local server.
    site.time = new Date(); // Match Jekyll's build timestamp for versioned CSS/JS URLs.
    site.url = localUrl;
    site.baseurl = '';
    site.data = {};
    for (const file of fs.readdirSync(path.join(root, '_data'))) {
      if (/\.(?:ya?ml|json)$/.test(file)) site.data[file.replace(/\.(?:ya?ml|json)$/, '')] = YAML.parse(read('_data/' + file));
    }
    // Match the Jekyll static_files fields used by the automatic cover-photo pool.
    site.static_files = [];
    function listBackgroundFiles(folder) {
      if (!fs.existsSync(path.join(root, folder))) return;
      for (const entry of fs.readdirSync(path.join(root, folder), { withFileTypes: true })) {
        if (entry.name.startsWith('.') || entry.isSymbolicLink()) continue;
        const relative = folder + '/' + entry.name;
        if (entry.isDirectory()) listBackgroundFiles(relative);
        else site.static_files.push({ path: '/' + relative, name: entry.name, extname: path.extname(entry.name) });
      }
    }
    listBackgroundFiles('images/background');
    const page = frontmatter(read('_pages/about.md'));
    const layout = frontmatter(read('_layouts/default.html'));
    const context = { site, page: { ...page.data, url: '/' }, layout: layout.data };
    let body = await liquid.parseAndRender(includes(page.body), context);
    const blocks = [];
    // The homepage uses Jekyll's markdown="1" blocks inside HTML sections.
    body = body.replace(/(<div\b[^>]*?)\s+markdown="1"([^>]*>)([\s\S]*?)(<\/div>)/g, (_, start, end, inner, close) => {
      const index = blocks.length;
      blocks.push(start + end + '\n' + markdown.render(inner.trim()) + close);
      return '\n\n<div data-preview-block="' + index + '"></div>\n\n';
    });
    let content = markdown.render(body);
    blocks.forEach((block, index) => { content = content.replace('<div data-preview-block="' + index + '"></div>', block); });
    let html = await liquid.parseAndRender(includes(layout.body), { ...context, content });
    if (!buildOnly) html = html.replace('</body>', reloadScript + '\n</body>');
    const css = sass.compileString(frontmatter(read('assets/css/main.scss')).body, {
      loadPaths: [path.join(root, '_sass')], style: 'compressed', logger: sass.Logger.silent
    }).css;
    fs.mkdirSync(output, { recursive: true });
    for (const folder of ['assets', 'images', 'files']) {
      if (fs.existsSync(path.join(root, folder))) fs.cpSync(path.join(root, folder), path.join(output, folder), { recursive: true });
    }
    fs.writeFileSync(path.join(output, 'assets/css/main.css'), css);
    fs.writeFileSync(path.join(output, 'index.html'), html);
    revision++;
    lastError = '';
    console.log('Built homepage preview (' + new Date().toLocaleTimeString() + ').');
  }

  if (buildOnly) {
    await build();
    console.log('Output: ' + output);
    return;
  }
  const mime = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.json': 'application/json',
    '.webmanifest': 'application/manifest+json', '.pdf': 'application/pdf'
  };
  const server = http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400).end('Bad request'); return; }
    if (pathname === '/__preview_status') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      res.end(JSON.stringify({ revision, error: lastError }));
      return;
    }
    if (!revision) { res.writeHead(503).end('Building local preview...'); return; }
    const target = path.resolve(output, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(output, target);
    if (relative.startsWith('..') || path.isAbsolute(relative) || pathname.includes('\0')) {
      res.writeHead(403).end('Forbidden'); return;
    }
    fs.readFile(target, (error, data) => {
      if (error) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
  await new Promise((resolve, reject) => {
    server.once('error', error => {
      if (requestedPort !== 0 && ['EADDRINUSE', 'EACCES'].includes(error.code)) {
        console.log('Port ' + requestedPort + ' unavailable; choosing a free local port.');
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
      } else reject(error);
    });
    server.listen(requestedPort, '127.0.0.1', resolve);
  });
  localUrl = 'http://127.0.0.1:' + server.address().port;
  try { await build(); }
  catch (error) { server.close(); throw error; }
  console.log('\nLocal preview: ' + localUrl + '/');
  console.log('Source changes rebuild and refresh the browser automatically. Press Ctrl+C to stop.\n');

  // Polling also works on Windows/Ubuntu network and synchronized folders.
  const sources = ['_config.yml', '_data', '_pages', '_layouts', '_includes', '_sass', 'assets', 'images', 'files'];
  function fingerprint() {
    const result = [];
    function visit(file) {
      if (!fs.existsSync(file)) return;
      const stat = fs.lstatSync(file);
      if (stat.isSymbolicLink()) return;
      if (stat.isDirectory()) for (const name of fs.readdirSync(file).sort()) visit(path.join(file, name));
      else result.push(file + ':' + stat.mtimeMs + ':' + stat.size);
    }
    for (const source of sources) visit(path.join(root, source));
    return result.join('\n');
  }
  let previous = fingerprint();
  let building = false;
  const watcher = setInterval(async () => {
    if (building) return;
    try {
      const next = fingerprint();
      if (next === previous) return;
      previous = next;
      building = true;
      await build();
    } catch (error) {
      lastError = error.message;
      console.error('Build failed; fix the source and save again:\n' + error.message);
    } finally { building = false; }
  }, 750);
  function stop() {
    clearInterval(watcher);
    console.log('\nLocal preview stopped.');
    server.close(() => process.exit(0));
    server.closeAllConnections();
  }
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

main().catch(error => { console.error(error.message); process.exit(1); });
