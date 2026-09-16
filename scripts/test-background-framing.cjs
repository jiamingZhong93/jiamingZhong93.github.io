'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { frame } = require('../assets/js/background-framing.js');

// Reconstruct the visible source rectangle from CSS object-position, so tests
// verify actual cover geometry rather than a particular formatting of numbers.
function verifyContained(source, subject, viewport) {
  const result = frame(source, subject, viewport);
  assert.ok(result, `Subject should fit ${viewport.join(' × ')}`);
  const [px, py] = result.position.split(' ').map(value => parseFloat(value) / 100);
  const scale = Math.max(viewport[0] / source[0], viewport[1] / source[1]);
  const visible = viewport.map(size => size / scale);
  const origin = source.map((size, axis) => (size - visible[axis]) * [px, py][axis]);
  for (let axis = 0; axis < 2; axis++) {
    assert.ok([px, py][axis] >= 0 && [px, py][axis] <= 1);
    assert.ok(origin[axis] <= subject[axis] + 1e-5);
    assert.ok(origin[axis] + visible[axis] >= subject[axis] + subject[axis + 2] - 1e-5);
  }
  return result;
}

test('low subjects remain visible from phones through wide desktop banners', () => {
  for (const viewport of [[390, 150], [800, 150], [1000, 220], [1920, 220]]) {
    verifyContained([4000, 3000], [1000, 2100, 2000, 400], viewport);
  }
});

test('a tall landmark fits a phone crop but is rejected when a flatter crop would cut it', () => {
  const source = [4032, 3024];
  const landmark = [2300, 550, 250, 1200];
  verifyContained(source, landmark, [390, 150]);
  for (const viewport of [[800, 150], [1000, 220], [1920, 220]]) {
    assert.equal(frame(source, landmark, viewport), null);
  }
});

test('reviewed goose and Toronto landmarks stay whole at supported banner sizes', () => {
  const photos = [
    { name: 'Waterloo geese', box: [1000, 1510, 2470, 880], fits: [true, false, true, false] },
    { name: 'Toronto skyline', box: [1980, 1510, 180, 760], fits: [true, false, true, false] },
    { name: 'Toronto sunset', box: [2490, 1130, 210, 710], fits: [true, true, true, false] },
    { name: 'Toronto waterfront', box: [1910, 1060, 220, 1250], fits: [true, false, false, false] }
  ];
  const viewports = [[390, 150], [800, 150], [1000, 220], [1920, 220]];
  for (const photo of photos) {
    viewports.forEach((viewport, index) => {
      if (photo.fits[index]) verifyContained([4032, 3024], photo.box, viewport);
      else assert.equal(frame([4032, 3024], photo.box, viewport), null, `${photo.name} at ${viewport}`);
    });
  }
});

test('subjects near either edge are retained by clamping the crop to the image', () => {
  assert.equal(verifyContained([4000, 3000], [200, 0, 800, 100], [1000, 220]).position, '50% 0%');
  assert.equal(verifyContained([4000, 3000], [200, 2900, 800, 100], [1000, 220]).position, '50% 100%');
  assert.equal(verifyContained([4000, 3000], [0, 500, 100, 500], [150, 390]).position, '0% 50%');
  assert.equal(verifyContained([4000, 3000], [3900, 500, 100, 500], [150, 390]).position, '100% 50%');
});

test('horizontal overflow is rejected just as vertical overflow is', () => {
  assert.equal(frame([4000, 3000], [1000, 1000, 1500, 500], [150, 390]), null);
  assert.equal(frame([4000, 3000], [1000, 1000, 500, 1600], [390, 150]), null);
});

test('exactly fitting subjects and uncropped images remain valid', () => {
  assert.deepEqual(frame([4000, 3000], [0, 0, 4000, 3000], [800, 600]), { position: '50% 50%' });
  verifyContained([4000, 3000], [0, 1400, 4000, 880], [1000, 220]);
  verifyContained([3000, 4000], [1400, 0, 880, 4000], [220, 1000]);
});

test('fractional dimensions preserve the subject despite floating-point cover arithmetic', () => {
  verifyContained([4032, 3024], [800.25, 2010.1, 900.5, 300.2], [1199.5, 220.25]);
  verifyContained([4032, 3024], [800, 1200, 500, 4032 * 220 / 1920], [1920, 220]);
});

test('invalid geometry returns null without throwing or coercing configuration values', () => {
  const source = [4000, 3000];
  const subject = [100, 100, 100, 100];
  const viewport = [390, 150];
  for (const invalid of [undefined, null, {}, [], new Array(2), [4000], [4000, 3000, 1], ['4000', 3000], [0, 3000], [-1, 3000], [Infinity, 3000], [NaN, 3000]]) {
    assert.equal(frame(invalid, subject, viewport), null);
    assert.equal(frame(source, subject, invalid), null);
  }
  for (const invalid of [null, [], new Array(4), [100, 100, 100], [0, 0, 1, 1, 1], ['0', 0, 1, 1], [NaN, 0, 1, 1], [0, 0, Infinity, 1], [-1, 0, 10, 10], [0, -1, 10, 10], [0, 0, 0, 10], [0, 0, 10, -1], [3990, 0, 20, 10], [0, 2990, 10, 20]]) {
    assert.equal(frame(source, invalid, viewport), null);
  }
});
