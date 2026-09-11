'use strict';

// One shuffle per visit; composition and photo details survive language/size changes.
(() => {
  const cover = document.querySelector('.home-background');
  if (!cover) return;
  const template = cover.querySelector('.home-background__pool');
  const tiles = cover.querySelector('[data-background-tiles]');
  if (!template || !tiles) return;
  const pool = Array.from(template.content.querySelectorAll('.home-background__tile'));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const failed = new Set();
  const rendered = new Map();
  let current = [];

  function localize(tile) {
    const chinese = document.documentElement.lang === 'zh-CN';
    for (const text of tile.querySelectorAll('[data-photo-en]')) {
      text.textContent = chinese ? text.dataset.photoZh : text.dataset.photoEn;
    }
    const button = tile.querySelector('button');
    if (button) {
      const caption = tile.querySelector('[data-photo-en]').textContent;
      button.setAttribute('aria-label', (chinese ? '照片说明：' : 'Photo details: ') + caption);
    }
  }

  function prepare(item, index) {
    if (rendered.has(item)) return rendered.get(item);
    const tile = item.cloneNode(true);
    const picture = tile.querySelector('img, image');
    if (picture.tagName === 'IMG') picture.fetchPriority = index === 0 ? 'high' : 'auto';
    picture.addEventListener('error', () => { failed.add(item); render(); }, { once: true });
    const button = tile.querySelector('button');
    const caption = tile.querySelector('figcaption');
    if (button && caption) {
      let pinned = false;
      const show = open => { caption.hidden = !open; button.setAttribute('aria-expanded', String(open)); };
      tile.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') show(true); });
      tile.addEventListener('pointerleave', () => { if (!pinned && !tile.contains(document.activeElement)) show(false); });
      tile.addEventListener('focusin', () => show(true));
      tile.addEventListener('focusout', event => { if (!pinned && !tile.contains(event.relatedTarget)) show(false); });
      button.addEventListener('click', () => { pinned = !pinned; show(pinned); });
      tile.addEventListener('keydown', event => {
        if (event.key === 'Escape') { pinned = false; button.focus(); show(false); }
      });
    }
    localize(tile);
    rendered.set(item, tile);
    return tile;
  }

  function render() {
    const available = pool.filter(item => !failed.has(item));
    if (!available.length) { cover.hidden = true; return; }
    const lead = available.find(item => item.dataset.role !== 'detail') || available[0];
    const remaining = available.filter(item => item !== lead);
    const order = [lead, ...remaining.filter(item => item.dataset.role !== 'main'), ...remaining.filter(item => item.dataset.role === 'main')];
    const count = window.matchMedia('(max-width: 800px)').matches ? 2 : 3;
    const selected = order.slice(0, count);
    if (selected.length === current.length && selected.every((item, index) => item === current[index])) return;
    current = selected;
    tiles.replaceChildren(...selected.map(prepare));
  }

  render();
  document.addEventListener('site:language-change', () => rendered.forEach(localize));
  if ('ResizeObserver' in window) new ResizeObserver(render).observe(cover);
  else window.addEventListener('resize', render);
})();
