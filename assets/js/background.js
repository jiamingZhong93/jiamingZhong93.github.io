'use strict';

// The build discovers images/background/. Randomness belongs to each page load,
// while resizing only changes how many photos from that fixed order are shown.
(() => {
  const cover = document.querySelector('.home-background');
  if (!cover) return;
  const template = cover.querySelector('.home-background__pool');
  const tiles = cover.querySelector('[data-background-tiles]');
  if (!template || !tiles) return;
  const pool = Array.from(template.content.querySelectorAll('img'));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const failed = new Set();
  const images = new Map();
  let current = [];
  function render() {
    const available = pool.filter(item => !failed.has(item));
    if (!available.length) {
      cover.hidden = true;
      return;
    }
    const mobile = window.matchMedia('(max-width: 800px)').matches;
    const configuredWidth = Number(mobile ? cover.dataset.mobileTileWidth : cover.dataset.tileWidth);
    const tileWidth = Number.isFinite(configuredWidth) && configuredWidth > 0 ? configuredWidth : 360;
    const count = Math.min(available.length, Math.max(2, Math.ceil(cover.clientWidth / tileWidth)));
    const selected = available.slice(0, count);
    if (selected.length === current.length && selected.every((item, index) => item === current[index])) return;
    current = selected;
    tiles.replaceChildren(...selected.map((item, index) => {
      if (!images.has(item)) {
        // Cloning only selected items avoids downloading the entire photo folder.
        const img = item.cloneNode(true);
        img.fetchPriority = index === 0 ? 'high' : 'auto';
        img.addEventListener('error', () => {
          failed.add(item);
          render();
        }, { once: true });
        images.set(item, img);
      }
      return images.get(item);
    }));
  }
  render();
  if ('ResizeObserver' in window) new ResizeObserver(render).observe(cover);
  else window.addEventListener('resize', render);
})();
