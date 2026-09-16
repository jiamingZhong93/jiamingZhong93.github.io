'use strict';

// Keep a photo's subject inside an edge-to-edge object-fit: cover crop.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BackgroundFraming = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const numbers = (value, length) => Array.isArray(value) && value.length === length
    && Array.from(value).every(number => typeof number === 'number' && Number.isFinite(number));

  // Dimensions and subject bounds are in original-image pixels. Returning null
  // means cover would necessarily crop the subject at this viewport size.
  function frame(sourceSize, subjectBox, viewportSize) {
    if (!numbers(sourceSize, 2) || !numbers(subjectBox, 4) || !numbers(viewportSize, 2)) return null;
    const [width, height] = sourceSize;
    const [x, y, subjectWidth, subjectHeight] = subjectBox;
    const [viewportWidth, viewportHeight] = viewportSize;
    if (width <= 0 || height <= 0 || viewportWidth <= 0 || viewportHeight <= 0
      || x < 0 || y < 0 || subjectWidth <= 0 || subjectHeight <= 0
      || x + subjectWidth > width || y + subjectHeight > height) return null;

    const scale = Math.max(viewportWidth / width, viewportHeight / height);
    const visibleWidth = viewportWidth / scale;
    const visibleHeight = viewportHeight / scale;
    if (!Number.isFinite(scale) || scale <= 0 || visibleWidth <= 0 || visibleHeight <= 0) return null;
    const tolerance = Math.max(width, height) * 1e-9;
    if (subjectWidth > visibleWidth + tolerance || subjectHeight > visibleHeight + tolerance) return null;

    function position(size, visible, start, extent) {
      const overflow = size - visible;
      if (overflow <= tolerance) return 50;
      const origin = Math.max(0, Math.min(overflow, start + extent / 2 - visible / 2));
      return Number((origin / overflow * 100).toFixed(8));
    }

    return { position: `${position(width, visibleWidth, x, subjectWidth)}% ${position(height, visibleHeight, y, subjectHeight)}%` };
  }

  return { frame };
});
