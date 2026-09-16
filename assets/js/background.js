'use strict';

// Preload a fixed weighted next candidate and preserve the current crossfade.
// Details add one extra second per slide; only visibility pauses the remaining time.
(() => {
  const cover = document.querySelector('.home-background');
  if (!cover) return;
  const templates = Array.from(cover.querySelector('.home-background__pool').content.querySelectorAll('figure'));
  const singles = templates.filter(item => !item.hasAttribute('data-photo-group'));
  const byKey = new Map(singles.map(item => [item.dataset.photoKey, item]));
  const groupMembers = new Map();
  const memberGroup = new Map();
  const groupIds = new Set();
  // Invalid, disabled or overlapping groups fall back to the configured single photos.
  for (const group of templates.filter(item => item.hasAttribute('data-photo-group'))) {
    if (!group.dataset.photoGroup || groupIds.has(group.dataset.photoGroup)) continue;
    const members = Array.from(group.querySelectorAll('.home-background__tile'), tile => byKey.get(tile.dataset.photoKey));
    if (members.length < 2 || members.some(item => !item || item.dataset.desktop === 'false' || memberGroup.has(item)) || new Set(members).size !== members.length) continue;
    groupIds.add(group.dataset.photoGroup);
    groupMembers.set(group, members);
    for (const member of members) memberGroup.set(member, group);
  }
  const pool = [...singles, ...groupMembers.keys()];
  const itemByKey = new Map(pool.map(item => [item.dataset.photoKey, item]));
  let storage;
  try { storage = window.localStorage; } catch {}
  const rotation = window.BackgroundRotation.create({
    entries: pool.map(item => ({
      key: item.dataset.photoKey,
      category: item.dataset.photoCategory,
      members: groupMembers.has(item) ? groupMembers.get(item).map(member => member.dataset.photoKey) : [item.dataset.photoKey]
    })),
    weights: { experience: cover.dataset.experienceWeight, scenery: cover.dataset.sceneryWeight },
    storage
  });
  const desktopLayout = window.matchMedia('(min-width: 801px)');
  const widthQueries = new Map();
  function widthLimits(field) {
    const limits = new Map();
    for (const item of singles) {
      const width = Number(item.dataset[field]);
      if (!Number.isFinite(width) || width <= 0) continue;
      if (!widthQueries.has(width)) widthQueries.set(width, window.matchMedia(`(max-width: ${width}px)`));
      limits.set(item, widthQueries.get(width));
    }
    return limits;
  }
  const desktopWidthLimits = widthLimits('desktopMaxWidth');
  const mobileWidthLimits = widthLimits('mobileMaxWidth');
  // These padded source rectangles protect subjects such as geese and the CN Tower.
  // Ordinary scenery keeps its manually chosen desktop/mobile focal position.
  const subjects = new Map(singles.filter(item => item.dataset.photoSubject).map(item => [item, {
    source: item.dataset.photoSize.split(/\s+/).map(Number),
    box: item.dataset.photoSubject.split(/\s+/).map(Number)
  }]));
  function subjectFrame(item) {
    const subject = subjects.get(item);
    return window.BackgroundFraming.frame(subject.source, subject.box, [cover.clientWidth, cover.clientHeight]);
  }
  function frameRecord(record) {
    if (!subjects.has(record.item)) return;
    const framing = subjectFrame(record.item);
    if (framing) record.node.querySelector('.home-background__image').style.objectPosition = framing.position;
  }
  const stage = cover.querySelector('[data-background-stage]');
  const controls = cover.querySelector('.home-background__controls');
  const panels = { current: controls.querySelector('#current-photo-info'), next: controls.querySelector('#next-photo-info') };
  const configured = Number(cover.dataset.interval);
  const interval = Number.isFinite(configured) && configured > 0 ? configured : 3000;
  const configuredExtra = Number(cover.dataset.infoExtra);
  const infoExtra = Number.isFinite(configuredExtra) && configuredExtra >= 0 ? configuredExtra : 1000;
  const configuredFade = Number(cover.dataset.fadeDuration);
  const fadeDuration = Number.isFinite(configuredFade) && configuredFade >= 0 ? configuredFade : 1000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  const failed = new Set();
  const holdDuration = 500;
  let current = null;
  let upcoming = null;
  let nextTask = null;
  let nextVersion = 0;
  let switching = true;
  let layoutPending = false;
  let layoutVersion = 0;
  const layoutWaiters = new Set();
  let manualRequested = false;
  let lastSwitch = -Infinity;
  let timer = null;
  let deadline = 0;
  let remaining = interval;
  let infoExtended = false;
  let inView = true;
  let mouseInside = false;
  let touchOpen = false;
  let touchHeld = false;
  let keyboardFocus = false;
  let dismissed = false;
  let inputMode = 'pointer';
  let pointerType = 'mouse';
  let pointerStart = null;
  let holdTimer = null;
  let suppressClick = false;

  function eligible(item) {
    if (!item || failed.has(item)) return false;
    if (groupMembers.has(item)) return desktopLayout.matches && groupMembers.get(item).every(member => !desktopWidthLimits.has(member) || desktopWidthLimits.get(member).matches);
    if (desktopLayout.matches && item.dataset.desktop === 'false') return false;
    const limits = desktopLayout.matches ? desktopWidthLimits : mobileWidthLimits;
    if (limits.has(item) && !limits.get(item).matches) return false;
    if (subjects.has(item) && !subjectFrame(item)) return false;
    const group = memberGroup.get(item);
    return !desktopLayout.matches || !group || !eligible(group);
  }
  function available(exclude) { return pool.filter(item => item !== exclude && eligible(item)); }
  function trimCache() {
    for (const item of cache.keys()) {
      if (item !== current?.item && item !== upcoming?.item) cache.delete(item);
    }
  }
  function hasNext() { return current && rotation.hasNext(available(current.item).map(item => item.dataset.photoKey)); }
  function language() { return document.documentElement.lang === 'zh-CN'; }
  function isInfo(target) { return Object.values(panels).some(panel => panel.contains(target)); }
  function detailsVisible() { return Boolean(current && !dismissed && (mouseInside || touchOpen || keyboardFocus)); }
  function visibilityPaused() { return document.hidden || !inView; }

  function syncTimer(reset = false) {
    if (timer !== null) {
      remaining = Math.max(0, deadline - performance.now());
      clearTimeout(timer); timer = null;
    }
    if (reset) remaining = interval + (infoExtended ? infoExtra : 0);
    // Repeated hover/press events never accumulate additional time on one photo.
    if (detailsVisible() && !infoExtended) { infoExtended = true; remaining += infoExtra; }
    if (current && hasNext() && !switching && !visibilityPaused()) {
      deadline = performance.now() + remaining;
      timer = setTimeout(() => { timer = null; remaining = 0; advance(true); }, remaining);
    }
  }

  // A breakpoint change can interrupt network waiting, but not the visible fade.
  function waitForLayout(promise) {
    return new Promise(resolve => {
      let settled = false;
      const cancel = () => finish(null);
      function finish(record) {
        if (settled) return;
        settled = true;
        layoutWaiters.delete(cancel);
        resolve(record);
      }
      layoutWaiters.add(cancel);
      Promise.resolve(promise).then(finish, () => finish(null));
    });
  }

  function preload(url) {
    return new Promise(resolve => {
      const probe = new Image();
      let settled = false;
      const timeout = setTimeout(() => finish(false), 15000);
      function finish(ok) {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        probe.onload = probe.onerror = null;
        resolve(ok);
      }
      probe.onload = () => finish(true);
      probe.onerror = () => finish(false);
      probe.src = url;
      if (probe.complete && probe.naturalWidth > 0) finish(true);
    });
  }

  function prepare(item) {
    if (cache.has(item)) return cache.get(item);
    const node = item.cloneNode(true);
    node.querySelector('figcaption').remove();
    const media = Array.from(node.querySelectorAll('img, image'));
    for (const image of media) if (image.tagName === 'IMG') image.draggable = false;
    const urls = [...new Set(media.map(image => image.getAttribute('src') || image.getAttribute('href')))];
    // A desktop strip becomes visible only when every tile is ready. Mobile uses
    // single-photo templates, so it never downloads the other tiles in a group.
    const promise = Promise.all(urls.map(preload)).then(results => {
      if (!results.length || results.some(ok => !ok)) { failed.add(item); return null; }
      return { item, node };
    });
    cache.set(item, promise);
    return promise;
  }

  async function loadRandom(exclude, valid = () => true) {
    while (valid()) {
      const choice = rotation.peek(available().map(item => item.dataset.photoKey), { exclude: exclude?.dataset.photoKey });
      if (!choice) break;
      const item = itemByKey.get(choice.key);
      const record = await waitForLayout(prepare(item));
      if (valid() && record && eligible(item)) return { ...record, choice };
      if (item !== current?.item && item !== upcoming?.item) cache.delete(item);
    }
    return null;
  }

  function updateInfo() {
    const zh = language();
    const open = detailsVisible();
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
    clearHold(); pointerStart = null; suppressClick = true; touchOpen = false; touchHeld = false;
    refreshInteraction();
  }

  function queueNext() {
    const version = ++nextVersion;
    upcoming = null;
    updateInfo();
    nextTask = loadRandom(current.item, () => version === nextVersion).then(record => {
      if (version !== nextVersion) return null;
      upcoming = record;
      trimCache();
      refreshInteraction();
      return record;
    });
  }

  async function display(record) {
    const previous = current;
    current = record;
    frameRecord(record);
    infoExtended = false;
    remaining = interval;
    // A released long press is readable on its current slide, but does not latch
    // captions onto future slides. A finger still held down carries across fades.
    touchOpen = touchHeld;
    // Keep the old photo fully visible underneath: no blank frame or dark dip.
    if (previous) stage.append(record.node);
    else stage.replaceChildren(record.node); // Replace the HTML poster once a random photo is ready.
    controls.hidden = false;
    rotation.commit(record.choice || record.item.dataset.photoKey);
    queueNext();
    if (previous && fadeDuration > 0 && !reducedMotion.matches && record.node.animate) {
      const fade = record.node.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: fadeDuration, easing: 'ease-in-out'
      });
      try { await fade.finished; } catch {} // Cancellation still leaves a complete photo.
    }
    if (previous) {
      previous.node.remove();
      // A large photo library should not retain every decoded slide on mobile.
      if (!upcoming || upcoming.item !== previous.item) cache.delete(previous.item);
    }
    touchOpen = touchHeld;
    updateInfo();
  }

  async function advance(automatic = false) {
    if (switching) { if (!automatic) manualRequested = true; return; }
    if (!hasNext() || performance.now() - lastSwitch < 180) return;
    manualRequested = !automatic;
    switching = true; syncTimer();
    const record = await waitForLayout(nextTask);
    // Visibility or a newly earned caption second can change while loading.
    // Explicit clicks still advance immediately once the next photo is ready.
    if (!layoutPending && !manualRequested && (visibilityPaused() || remaining > 0)) {
      switching = false; syncTimer(); return;
    }
    if (record && eligible(record.item) && !layoutPending) {
      await display(record);
      lastSwitch = performance.now();
    }
    switching = false;
    if (layoutPending) reconcileLayout();
    else syncTimer(true);
  }

  async function reconcileLayout() {
    layoutPending = true;
    if (switching) return;
    switching = true; syncTimer();
    ++nextVersion; upcoming = null; nextTask = null;
    while (layoutPending) {
      layoutPending = false;
      const members = groupMembers.get(current?.item);
      const group = memberGroup.get(current?.item);
      let target = desktopLayout.matches
        ? (group && !failed.has(group) ? group : current?.item)
        : (members ? members.find(eligible) : current?.item);
      // A mobile-only photo must map to an eligible desktop replacement, even
      // when it has no group. Otherwise the resize loop would retain it forever.
      if (!eligible(target)) target = null;
      const version = layoutVersion;
      let record = target && target === current?.item ? current : target ? await waitForLayout(prepare(target)) : null;
      if (version !== layoutVersion) { layoutPending = true; continue; }
      // A failed group makes its individual photos eligible again.
      if (!record && eligible(current?.item)) record = current;
      if (!record) record = await loadRandom(null);
      if (version !== layoutVersion) { layoutPending = true; continue; }
      if (!record) { cover.hidden = true; break; }
      if (!eligible(record.item)) { layoutPending = true; continue; }
      cover.hidden = false;
      if (record !== current) await display(record);
      else { frameRecord(record); queueNext(); }
    }
    switching = false; syncTimer(true);
  }
  function layoutChanged() {
    layoutVersion++;
    for (const cancel of Array.from(layoutWaiters)) cancel();
    reconcileLayout();
  }
  desktopLayout.addEventListener('change', layoutChanged);
  for (const limit of widthQueries.values()) limit.addEventListener('change', layoutChanged);
  // Subject fit depends on the actual banner dimensions, including tablet widths
  // between CSS breakpoints. Reframe or select an eligible replacement on resize.
  let bannerSize = [cover.clientWidth, cover.clientHeight];
  if (subjects.size && 'ResizeObserver' in window) {
    new ResizeObserver(() => {
      const size = [cover.clientWidth, cover.clientHeight];
      if (size.every((value, index) => value === bannerSize[index])) return;
      bannerSize = size;
      layoutChanged();
    }).observe(cover);
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
    // Reading captions never changes the photo.
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
      mouseInside = false; touchOpen = false; touchHeld = false; clearHold(); pointerStart = null;
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
      clearHold(); touchOpen = false; touchHeld = false; dismissed = true; refreshInteraction();
    } else if (event.target === cover && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      if (!event.repeat) advance();
    }
  });

  cover.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) { cancelGesture(); return; }
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      holdTimer = setTimeout(() => {
        holdTimer = null; suppressClick = true; touchOpen = true; touchHeld = true; dismissed = false;
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
    clearHold(); pointerStart = null; touchHeld = false; syncTimer();
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
    clearHold(); pointerStart = null; touchOpen = false; touchHeld = false;
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

  loadRandom(null).then(async record => {
    if (!record) {
      cover.hidden = true; switching = false;
      if (layoutPending) reconcileLayout();
      return;
    }
    // Covers a stationary mouse that was already here when the script loaded.
    mouseInside = window.matchMedia('(hover: hover)').matches && cover.matches(':hover');
    await display(record);
    switching = false;
    if (layoutPending) reconcileLayout();
    else syncTimer(true);
  });
})();
