'use strict';

// Navigation labels come only from _data/navigation.yml, in both languages.
(() => {
  const nav = document.getElementById('profile-nav');
  if (!nav) return;
  const header = nav.closest('.masthead');
  const toggle = nav.querySelector('.profile-nav__toggle');
  const label = nav.querySelector('[data-current-section]');
  const links = Array.from(nav.querySelectorAll('a'));
  const sections = links.map(link => ({ link, target: document.getElementById(new URL(link.href).hash.slice(1)) })).filter(item => item.target);
  if (!sections.length) return;
  const compact = window.matchMedia('(max-width: 800px)');
  let active = sections[0];
  let scheduled = false;

  function render() {
    const zh = document.documentElement.lang === 'zh-CN';
    label.textContent = zh ? active.link.dataset.navZh : active.link.dataset.navEn;
    toggle.setAttribute('aria-label', (zh ? '章节导航：' : 'Section navigation: ') + label.textContent);
    for (const item of sections) {
      if (item === active) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    }
  }
  function close() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function update() {
    scheduled = false;
    const offset = header.getBoundingClientRect().height + 45;
    active = sections[0];
    for (const item of sections) if (item.target.getBoundingClientRect().top <= offset) active = item;
    // The last section can be shorter than the viewport.
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3) active = sections[sections.length - 1];
    render();
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }
  function goTo(item) {
    const top = item === sections[0] ? 0 : item.target.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  toggle.hidden = false;
  nav.classList.add('is-enhanced');
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  // Capture avoids the legacy theme's jQuery smoothScroll handler (-20px).
  nav.addEventListener('click', event => {
    const item = sections.find(item => item.link === event.target.closest('a'));
    if (!item || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); event.stopPropagation();
    close();
    if (compact.matches) toggle.focus({ preventScroll: true });
    if (location.hash !== item.link.hash) history.pushState(null, '', item.link.hash);
    goTo(item);
  }, true);
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape') { close(); toggle.focus({ preventScroll: true }); }
  });
  nav.addEventListener('focusout', event => { if (!nav.contains(event.relatedTarget)) close(); });
  document.addEventListener('pointerdown', event => { if (!nav.contains(event.target)) close(); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { if (!compact.matches) close(); schedule(); });
  window.addEventListener('popstate', () => {
    const item = sections.find(item => item.link.hash === location.hash);
    if (item) goTo(item);
  });
  document.addEventListener('site:language-change', update);
  update();
})();

// Default and alternate paths/crops are maintained together in _config.yml.
// No persisted state: every reload starts with the default portrait (also used by SEO).
(() => {
  const button = document.querySelector('.portrait-toggle');
  if (!button || !button.dataset.alternate) return;
  const image = button.querySelector('img');
  const original = { src: image.getAttribute('src'), alt: image.alt };
  let alternate = false;
  function render() {
    image.src = alternate ? button.dataset.alternate : original.src;
    image.alt = alternate ? (document.documentElement.lang === 'zh-CN' ? button.dataset.alternateAltZh : button.dataset.alternateAlt) : original.alt;
    image.style.objectPosition = alternate ? button.dataset.alternatePosition : button.dataset.defaultPosition;
  }
  function change() { if (!button.disabled) { alternate = !alternate; render(); } }
  const preload = new Image();
  preload.onload = () => { button.disabled = false; };
  preload.src = button.dataset.alternate;
  button.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') change(); });
  button.addEventListener('click', change);
  image.addEventListener('error', () => {
    if (alternate) { alternate = false; button.disabled = true; render(); }
  });
  document.addEventListener('site:language-change', render);
})();
