'use strict';

// Preload a fixed random next candidate and preserve the current crossfade.
// Hover, held/open touch details, keyboard focus, and visibility pause the remaining time.
(() => {
  const cover = document.querySelector('.home-background');
  if (!cover) return;
  const pool = Array.from(cover.querySelector('.home-background__pool').content.querySelectorAll('figure'));
  const stage = cover.querySelector('[data-background-stage]');
  const controls = cover.querySelector('.home-background__controls');
  const panels = { current: controls.querySelector('#current-photo-info'), next: controls.querySelector('#next-photo-info') };
  const configured = Number(cover.dataset.interval);
  const interval = Number.isFinite(configured) && configured > 0 ? configured : 3000;
  const configuredFade = Number(cover.dataset.fadeDuration);
  const fadeDuration = Number.isFinite(configuredFade) && configuredFade >= 0 ? configuredFade : 1000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  const failed = new Set();
  const storageKey = 'homepage:last-background';
  const holdDuration = 500;
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
  let mouseInside = false;
  let touchOpen = false;
  let keyboardFocus = false;
  let dismissed = false;
  let inputMode = 'pointer';
  let pointerType = 'mouse';
  let pointerStart = null;
  let holdTimer = null;
  let suppressClick = false;

  function available(exclude) { return pool.filter(item => item !== exclude && !failed.has(item)); }
  function hasNext() { return current && available(current.item).length > 0; }
  function random(items) { return items[Math.floor(Math.random() * items.length)]; }
  function language() { return document.documentElement.lang === 'zh-CN'; }
  function isInfo(target) { return Object.values(panels).some(panel => panel.contains(target)); }
  function interactionPaused() { return document.hidden || !inView || mouseInside || touchOpen || keyboardFocus || pointerStart !== null; }

  function syncTimer(reset = false) {
    if (reset) { clearTimeout(timer); timer = null; remaining = interval; }
    const paused = !current || !hasNext() || switching || interactionPaused();
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
      if (media.tagName === 'IMG') media.draggable = false;
      // Also preload assets referenced by SVG crop windows off-DOM.
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
    const open = Boolean(current && !dismissed && (mouseInside || touchOpen || keyboardFocus));
    cover.setAttribute('aria-label', zh
      ? '背景照片轮播。悬停或长按显示说明；按回车或空格切换下一张。'
      : 'Photo carousel. Hover or long press for details; press Enter or Space for the next photo.');
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
          label.textContent = zh ? '下一张' : 'Next';
          panel.append(label);
        }
        if (record) {
          const caption = record.item.querySelector('figcaption');
          if (kind === 'current') {
            panel.append(...Array.from(caption.childNodes, node => node.cloneNode(true)));
            for (const text of panel.querySelectorAll('[data-photo-en]')) text.textContent = zh ? text.dataset.photoZh : text.dataset.photoEn;
            const source = panel.querySelector('a.home-background__title');
            if (source) {
              const credit = zh ? source.dataset.photoCreditZh : source.dataset.photoCreditEn;
              if (credit) {
                source.title = credit;
                source.setAttribute('aria-label', source.textContent.trim() + '. ' + credit);
              }
            }
          } else {
            const title = document.createElement('span');
            title.className = 'home-background__title';
            const text = caption.querySelector('.home-background__title [data-photo-en], .home-background__title[data-photo-en]');
            title.textContent = zh ? text.dataset.photoZh : text.dataset.photoEn;
            panel.append(title);
          }
        } else {
          const title = document.createElement('span');
          title.className = 'home-background__title';
          title.textContent = zh ? '正在加载照片…' : 'Loading photo…';
          panel.append(title);
        }
      }
      panel.hidden = !open || (kind === 'next' && !hasNext());
    }
    cover.toggleAttribute('data-info-open', open);
  }

  function refreshInteraction() { updateInfo(); syncTimer(); }
  function clearHold() { clearTimeout(holdTimer); holdTimer = null; }
  function cancelGesture() {
    clearHold(); pointerStart = null; suppressClick = true; touchOpen = false;
    refreshInteraction();
  }

  function queueNext() {
    const version = ++nextVersion;
    upcoming = null;
    updateInfo();
    nextTask = loadRandom(current.item).then(record => {
      if (version !== nextVersion) return null;
      upcoming = record;
      refreshInteraction();
      return record;
    });
  }

  async function display(record) {
    const previous = current;
    current = record;
    // Keep the old photo fully visible underneath: no blank frame or dark dip.
    stage.append(record.node);
    controls.hidden = false;
    try { sessionStorage.setItem(storageKey, record.item.dataset.photoKey); } catch {}
    queueNext();
    if (previous && fadeDuration > 0 && !reducedMotion.matches && record.node.animate) {
      const fade = record.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeDuration, easing: 'ease-in-out'
      });
      try { await fade.finished; } catch {} // Cancellation still leaves a complete photo.
    }
    if (previous) previous.node.remove();
  }

  async function advance(automatic = false) {
    if (switching) { if (!automatic) manualRequested = true; return; }
    if (!hasNext() || performance.now() - lastSwitch < 180) return;
    manualRequested = !automatic;
    switching = true; syncTimer();
    const record = await nextTask;
    // A pause may start while a slow next photo loads; explicit clicks still win.
    if (!manualRequested && interactionPaused()) {
      switching = false; remaining = 0; syncTimer(); return;
    }
    if (record) {
      await display(record);
      lastSwitch = performance.now();
    }
    switching = false; syncTimer(true);
  }

  cover.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    mouseInside = true; dismissed = false; refreshInteraction();
  });
  cover.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    mouseInside = false; refreshInteraction();
  });
  for (const panel of Object.values(panels)) {
    // Reading captions and activating credits never changes the photo.
    panel.addEventListener('click', event => event.stopPropagation());
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Tab') inputMode = 'keyboard';
  }, true);
  document.addEventListener('pointerdown', event => {
    inputMode = 'pointer'; pointerType = event.pointerType; keyboardFocus = false;
    // A fresh gesture must not inherit suppression from an earlier long press.
    suppressClick = false;
    if (!event.isPrimary && pointerStart) cancelGesture();
    if (!cover.contains(event.target)) {
      mouseInside = false; touchOpen = false; clearHold(); pointerStart = null;
    }
    refreshInteraction();
  }, true);
  cover.addEventListener('focusin', () => {
    if (inputMode === 'keyboard') { keyboardFocus = true; dismissed = false; refreshInteraction(); }
  });
  cover.addEventListener('focusout', event => {
    if (!cover.contains(event.relatedTarget)) { keyboardFocus = false; refreshInteraction(); }
  });
  cover.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (isInfo(document.activeElement)) cover.focus({ preventScroll: true });
      clearHold(); touchOpen = false; dismissed = true; refreshInteraction();
    } else if (event.target === cover && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (!event.repeat) advance();
    }
  });

  cover.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) { cancelGesture(); return; }
    if (isInfo(event.target)) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      holdTimer = setTimeout(() => {
        holdTimer = null; suppressClick = true; touchOpen = true; dismissed = false;
        refreshInteraction();
      }, holdDuration);
    }
    syncTimer();
  });
  document.addEventListener('pointermove', event => {
    if (pointerStart && event.pointerId === pointerStart.id &&
        Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 12) cancelGesture();
  });
  document.addEventListener('pointerup', event => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    clearHold(); pointerStart = null; syncTimer();
  });
  document.addEventListener('pointercancel', event => {
    if (pointerStart && event.pointerId === pointerStart.id) cancelGesture();
  });
  cover.addEventListener('contextmenu', event => {
    if (pointerType !== 'mouse' && !isInfo(event.target)) event.preventDefault();
  });
  cover.addEventListener('click', event => {
    if (isInfo(event.target)) return;
    if (suppressClick) { suppressClick = false; event.preventDefault(); return; }
    clearHold(); pointerStart = null; touchOpen = false;
    refreshInteraction(); advance();
  });
  document.addEventListener('site:language-change', updateInfo);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && pointerStart) cancelGesture();
    syncTimer();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (!inView && pointerStart) cancelGesture();
      syncTimer();
    }).observe(cover);
  }

  let previous = null;
  try { previous = sessionStorage.getItem(storageKey); } catch {}
  loadRandom(null, previous).then(async record => {
    if (!record) { cover.hidden = true; return; }
    // Covers a stationary mouse that was already here when the script loaded.
    mouseInside = window.matchMedia('(hover: hover)').matches && cover.matches(':hover');
    await display(record); syncTimer(true);
  });
})();
