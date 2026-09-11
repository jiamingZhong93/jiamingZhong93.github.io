'use strict';

// A single current photo and a preloaded, fixed next candidate.
// The timer retains its remaining time while any interaction/visibility pause is active.
(() => {
  const cover = document.querySelector('.home-background');
  if (!cover) return;
  const pool = Array.from(cover.querySelector('.home-background__pool').content.querySelectorAll('figure'));
  const stage = cover.querySelector('[data-background-stage]');
  const controls = cover.querySelector('.home-background__controls');
  const info = controls.querySelector('.home-background__info');
  const next = controls.querySelector('.home-background__next');
  const panels = { current: controls.querySelector('#current-photo-info'), next: controls.querySelector('#next-photo-info') };
  const configured = Number(cover.dataset.interval);
  const interval = Number.isFinite(configured) && configured > 0 ? configured : 3000;
  const cache = new Map();
  const failed = new Set();
  let current = null;
  let upcoming = null;
  let nextTask = null;
  let nextVersion = 0;
  let switching = false;
  let manualRequested = false;
  let lastSwitch = -Infinity;
  let timer = null;
  let deadline = 0;
  let remaining = interval;
  let inView = true;
  let hovered = null;
  let panelHovered = false;
  let touchOpen = false;
  let keyboardFocus = false;
  let panelKind = null;
  let leaveTimer = null;
  let inputMode = 'pointer';
  let pointerType = 'mouse';
  let pointerStart = null;
  let dragged = false;
  const storageKey = 'homepage:last-background';

  function available(exclude) { return pool.filter(item => item !== exclude && !failed.has(item)); }
  function random(items) { return items[Math.floor(Math.random() * items.length)]; }
  function language() { return document.documentElement.lang === 'zh-CN'; }
  function interactionPaused() { return document.hidden || !inView || hovered || panelHovered || touchOpen || keyboardFocus; }

  function syncTimer(reset = false) {
    if (reset) {
      clearTimeout(timer); timer = null; remaining = interval;
    }
    const paused = !current || available(current.item).length === 0 || switching || interactionPaused();
    if (paused) {
      if (timer !== null) { remaining = Math.max(0, deadline - performance.now()); clearTimeout(timer); timer = null; }
    } else if (timer === null) {
      deadline = performance.now() + remaining;
      timer = setTimeout(() => { timer = null; remaining = 0; advance(true); }, remaining);
    }
  }

  function prepare(item) {
    if (cache.has(item)) return cache.get(item);
    const promise = new Promise(resolve => {
      const node = item.cloneNode(true);
      node.querySelector('figcaption').remove();
      const media = node.querySelector('img, image');
      // A normal Image also preloads assets referenced by SVG crop windows off-DOM.
      const probe = new Image();
      let settled = false;
      const timeout = setTimeout(() => finish(false), 15000);
      function finish(ok) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        probe.onload = probe.onerror = null;
        if (!ok) failed.add(item);
        resolve(ok ? { item, node } : null);
      }
      probe.onload = () => finish(true);
      probe.onerror = () => finish(false);
      probe.src = media.getAttribute('src') || media.getAttribute('href');
      if (probe.complete && probe.naturalWidth > 0) finish(true);
    });
    cache.set(item, promise);
    return promise;
  }

  async function loadRandom(exclude, firstAvoid) {
    let candidates = available(exclude);
    while (candidates.length) {
      const preferred = candidates.filter(item => item.dataset.photoKey !== firstAvoid);
      const record = await prepare(random(preferred.length ? preferred : candidates));
      if (record) return record;
      candidates = available(exclude);
    }
    return null;
  }

  function updateInfo() {
    const zh = language();
    info.setAttribute('aria-label', zh ? '当前照片信息' : 'Current photo information');
    next.setAttribute('aria-label', zh ? '预览或显示下一张照片' : 'Preview or show next photo');
    next.hidden = !current || available(current.item).length === 0;
    for (const kind of ['current', 'next']) {
      const panel = panels[kind];
      const record = kind === 'current' ? current : upcoming;
      const key = (record ? record.item.dataset.photoKey : 'loading') + ':' + zh;
      if (panel.dataset.contentKey !== key) {
        panel.dataset.contentKey = key;
        panel.replaceChildren();
        if (kind === 'next') {
          const label = document.createElement('small');
          label.className = 'home-background__label';
          label.textContent = zh ? '下一张' : 'Next photo';
          panel.append(label);
        }
        if (record) {
          panel.append(...Array.from(record.item.querySelector('figcaption').childNodes, node => node.cloneNode(true)));
          for (const text of panel.querySelectorAll('[data-photo-en]')) text.textContent = zh ? text.dataset.photoZh : text.dataset.photoEn;
        } else {
          panel.append(document.createTextNode(zh ? '正在加载照片…' : 'Loading photo…'));
        }
      }
      panel.hidden = panelKind !== kind;
    }
    info.setAttribute('aria-expanded', String(panelKind === 'current'));
    next.setAttribute('aria-expanded', String(panelKind === 'next'));
  }

  function openInfo(kind, touch = false) {
    if (kind === 'next' && next.hidden) return;
    clearTimeout(leaveTimer);
    panelKind = kind; touchOpen = touch;
    updateInfo(); syncTimer();
  }

  function closeInfo() {
    clearTimeout(leaveTimer);
    panelKind = null; touchOpen = false; panelHovered = false;
    updateInfo(); syncTimer();
  }

  function queueNext() {
    const version = ++nextVersion;
    upcoming = null;
    updateInfo();
    nextTask = loadRandom(current.item).then(record => {
      if (version !== nextVersion) return null;
      upcoming = record;
      if (!record && panelKind === 'next') closeInfo();
      updateInfo(); syncTimer();
      return record;
    });
  }

  function display(record) {
    current = record;
    stage.replaceChildren(record.node);
    controls.hidden = false;
    try { sessionStorage.setItem(storageKey, record.item.dataset.photoKey); } catch {}
    queueNext();
  }

  async function advance(automatic = false) {
    if (switching) { if (!automatic) manualRequested = true; return; }
    if (!current || next.hidden || performance.now() - lastSwitch < 180) return;
    manualRequested = !automatic;
    switching = true; syncTimer();
    const record = await nextTask;
    // A hover or visibility pause can begin while a slow next photo is loading.
    if (!manualRequested && interactionPaused()) {
      switching = false; remaining = 0; syncTimer(); return;
    }
    if (record) {
      closeInfo();
      display(record);
      lastSwitch = performance.now();
    }
    switching = false; syncTimer(true);
  }

  function delayedLeave() {
    clearTimeout(leaveTimer);
    leaveTimer = setTimeout(() => {
      if (!hovered && !panelHovered && !touchOpen && !keyboardFocus) closeInfo();
      syncTimer();
    }, 140);
  }

  for (const [kind, button] of [['current', info], ['next', next]]) {
    button.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = kind; openInfo(kind);
    });
    button.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      hovered = null; delayedLeave();
    });
    button.addEventListener('focus', () => {
      if (inputMode === 'keyboard') { keyboardFocus = true; openInfo(kind); }
    });
    button.addEventListener('click', event => {
      event.stopPropagation();
      const touch = event.detail !== 0 && (pointerType === 'touch' || pointerType === 'pen');
      if (kind === 'current') {
        if (panelKind === kind && touchOpen) closeInfo();
        else openInfo(kind, touch);
      } else if (touch && !(panelKind === 'next' && touchOpen)) openInfo('next', true);
      else advance();
    });
  }

  for (const panel of Object.values(panels)) {
    panel.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'mouse') return;
      clearTimeout(leaveTimer); panelHovered = true; syncTimer();
    });
    panel.addEventListener('pointerleave', event => {
      if (event.pointerType !== 'mouse') return;
      panelHovered = false; delayedLeave();
    });
    // Includes credit links: reading/clicking information never advances the photo.
    panel.addEventListener('click', event => event.stopPropagation());
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') inputMode = 'keyboard';
  }, true);
  document.addEventListener('pointerdown', event => {
    inputMode = 'pointer'; pointerType = event.pointerType;
    keyboardFocus = false;
    if (!cover.contains(event.target)) { hovered = null; closeInfo(); }
    syncTimer();
  }, true);
  controls.addEventListener('focusin', () => {
    if (inputMode === 'keyboard') { keyboardFocus = true; syncTimer(); }
  });
  controls.addEventListener('focusout', event => {
    if (!controls.contains(event.relatedTarget)) { keyboardFocus = false; delayedLeave(); }
  });
  controls.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const button = panelKind === 'next' ? next : info;
      if (Object.values(panels).some(panel => panel.contains(document.activeElement))) button.focus();
      closeInfo();
    }
  });
  cover.addEventListener('pointerdown', event => { pointerStart = { x: event.clientX, y: event.clientY }; dragged = false; });
  cover.addEventListener('pointermove', event => {
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 12) dragged = true;
  });
  cover.addEventListener('pointercancel', () => { dragged = true; pointerStart = null; });
  cover.addEventListener('click', () => { if (!dragged) { hovered = null; closeInfo(); advance(); } pointerStart = null; });
  document.addEventListener('site:language-change', updateInfo);
  document.addEventListener('visibilitychange', () => syncTimer());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncTimer(); }).observe(cover);
  }

  let previous = null;
  try { previous = sessionStorage.getItem(storageKey); } catch {}
  loadRandom(null, previous).then(record => {
    if (!record) { cover.hidden = true; return; }
    display(record); syncTimer(true);
  });
})();
