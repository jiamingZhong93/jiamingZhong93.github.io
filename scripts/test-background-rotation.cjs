'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const { create } = require('../assets/js/background-rotation.js');

function seeded(seed = 1) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function memory(initial = null) {
  let value = initial;
  return { getItem: () => value, setItem: (key, next) => { value = next; } };
}
function entries(experience = 8, scenery = 12) {
  return ['experience', 'scenery'].flatMap((category, index) =>
    Array.from({ length: index ? scenery : experience }, (_, i) => ({ key: `${category}-${i}`, category }))
  );
}
function next(rotation, keys, exclude) {
  const choice = rotation.peek(keys, { exclude });
  assert.ok(choice);
  assert.equal(rotation.commit(choice), true);
  return choice;
}

test('category probabilities remain 2:1 even with many more scenery photographs', () => {
  const library = entries(8, 120);
  const keys = library.map(entry => entry.key);
  const rotation = create({ entries: library, random: seeded(12) });
  let experience = 0;
  let previous;
  for (let i = 0; i < 18000; i++) {
    const choice = next(rotation, keys, previous);
    assert.notEqual(choice.key, previous);
    experience += choice.category === 'experience';
    previous = choice.key;
  }
  const ratio = experience / 18000;
  assert.ok(ratio > .65 && ratio < .685, `experience share ${ratio}`);
});

test('each category visits every eligible entry before repeating its deck', () => {
  const library = entries(9, 13);
  const keys = library.map(entry => entry.key);
  const rotation = create({ entries: library, random: seeded(21) });
  const cycle = { experience: new Set(), scenery: new Set() };
  let previous;
  for (let i = 0; i < 600; i++) {
    const choice = next(rotation, keys, previous);
    const seen = cycle[choice.category];
    if (choice.reset) {
      assert.equal(seen.size, choice.category === 'experience' ? 9 : 13);
      seen.clear();
    }
    assert.equal(seen.has(choice.key), false);
    seen.add(choice.key);
    previous = choice.key;
  }
});

test('edited category weights change odds and tolerate large finite values', () => {
  const library = entries(11, 10);
  const keys = library.map(entry => entry.key);
  for (const weights of [{ experience: 1, scenery: 4 }, { experience: 4e307, scenery: 1.6e308 }]) {
    const rotation = create({ entries: library, weights, random: seeded(23) });
    let scenery = 0;
    for (let i = 0; i < 5000; i++) scenery += next(rotation, keys).category === 'scenery';
    assert.ok(scenery / 5000 > .78 && scenery / 5000 < .82);
  }
});

test('refresh remembers displayed photographs but reshuffles the remaining deck', () => {
  const storage = memory();
  const library = entries(14, 0);
  const keys = library.map(entry => entry.key);
  const displayed = new Set();
  for (let refresh = 0; refresh < 14; refresh++) {
    const rotation = create({ entries: library, storage, random: seeded(refresh + 14) });
    const choice = next(rotation, keys);
    assert.equal(displayed.has(choice.key), false, 'reload repeated before exhaustion');
    displayed.add(choice.key);
  }
  const saved = JSON.parse(storage.getItem());
  const rotation = create({ entries: library, storage, random: seeded(50) });
  const nextChoice = rotation.peek(keys);
  assert.equal(nextChoice.reset, true);
  assert.notEqual(nextChoice.key, saved.history.at(-1).key);
});

test('refresh does not simply resume the same unseen order', () => {
  const library = entries(12, 0);
  const keys = library.map(entry => entry.key);
  const storage = memory();
  const initial = create({ entries: library, storage, random: seeded(31) });
  next(initial, keys);
  const saved = storage.getItem();
  const sequences = [31, 41].map(seed => {
    const rotation = create({ entries: library, storage: memory(saved), random: seeded(seed) });
    return Array.from({ length: 11 }, () => next(rotation, keys).key);
  });
  assert.notDeepEqual(sequences[0], sequences[1]);
  assert.deepEqual([...sequences[0]].sort(), [...sequences[1]].sort());
});

test('unshown preloads and failed candidates never change the persisted seen set', () => {
  const storage = memory();
  const library = entries(6, 0);
  const keys = library.map(entry => entry.key);
  const rotation = create({ entries: library, storage, random: seeded(3) });
  const shown = next(rotation, keys);
  const saved = storage.getItem();
  const speculative = rotation.peek(keys, { exclude: shown.key });
  assert.equal(storage.getItem(), saved);
  // A failed image is temporarily removed by the browser adapter, not consumed.
  const ready = rotation.peek(keys.filter(key => key !== speculative.key), { exclude: shown.key });
  rotation.commit(ready);
  const state = JSON.parse(storage.getItem());
  assert.equal(state.seen.experience.includes(speculative.key), false);
  assert.deepEqual(state.history.map(item => item.key), [shown.key, ready.key]);
  const refreshed = create({ entries: library, storage, random: seeded(4) });
  const visited = [];
  for (let i = 0; i < 4; i++) visited.push(next(refreshed, keys).key);
  assert.ok(visited.includes(speculative.key), 'cancelled or failed photo was lost');
});

test('new and deleted entries reconcile with saved state', () => {
  const storage = memory();
  const original = entries(3, 0);
  const old = create({ entries: original, storage, random: seeded(7) });
  for (const entry of original) old.commit(entry.key);
  const updated = [original[1], original[2], { key: 'new-photo', category: 'experience' }];
  const rotation = create({ entries: updated, storage, random: seeded(8) });
  const choice = next(rotation, updated.map(entry => entry.key));
  assert.equal(choice.key, 'new-photo');
  assert.equal(JSON.parse(storage.getItem()).seen.experience.includes(original[0].key), false);
});

test('desktop groups and mobile members share display history', () => {
  const library = [
    { key: 'a', category: 'experience' }, { key: 'b', category: 'experience' },
    { key: 'c', category: 'experience' }, { key: 'd', category: 'experience' },
    { key: 'group-ab', members: ['a', 'b'], category: 'experience' }
  ];
  const storage = memory();
  const rotation = create({ entries: library, storage, random: seeded(9) });
  rotation.commit('group-ab');
  const mobile = rotation.peek(['a', 'b', 'c', 'd']);
  assert.ok(['c', 'd'].includes(mobile.key));
  rotation.commit(mobile);
  const reloaded = create({ entries: library, storage, random: seeded(10) });
  assert.equal(reloaded.peek(['group-ab', 'c', 'd']).key, mobile.key === 'c' ? 'd' : 'c');
  // A deliberate resize mapping can display a member; no speculative pick is used.
  reloaded.commit('a');
  assert.notEqual(reloaded.peek(['group-ab', 'c', 'd']).key, 'group-ab');
});

test('newly eligible photos are visited when the viewport expands', () => {
  const library = entries(5, 0);
  const rotation = create({ entries: library, random: seeded(11) });
  const narrow = library.slice(0, 3).map(entry => entry.key);
  for (let i = 0; i < 3; i++) next(rotation, narrow);
  const wider = library.map(entry => entry.key);
  assert.ok(wider.slice(3).includes(next(rotation, wider).key));
  assert.ok(wider.slice(3).includes(next(rotation, wider).key));
});

test('zero category weights disable that category; both zero produce no candidate', () => {
  const library = entries();
  const keys = library.map(entry => entry.key);
  const rotation = create({ entries: library, weights: { experience: 0, scenery: 1 }, random: seeded(12) });
  for (let i = 0; i < 30; i++) assert.equal(next(rotation, keys).category, 'scenery');
  assert.equal(rotation.peek(keys.filter(key => key.startsWith('experience'))), null);
  const disabled = create({ entries: library, weights: { experience: 0, scenery: 0 } });
  assert.equal(disabled.peek(keys), null);
  assert.equal(disabled.hasNext(keys), false);
});

test('one-photo and empty libraries terminate without repeated advance loops', () => {
  const rotation = create({ entries: entries(1, 0) });
  assert.equal(next(rotation, ['experience-0']).key, 'experience-0');
  assert.equal(rotation.peek(['experience-0'], { exclude: 'experience-0' }), null);
  assert.equal(rotation.hasNext(['experience-0'], { exclude: 'experience-0' }), false);
  assert.equal(create({ entries: [] }).peek([]), null);
  assert.equal(rotation.commit('deleted'), false);
});

test('corrupt and unavailable localStorage preserve in-memory no-repeat behavior', () => {
  for (const storage of [memory('{invalid'), memory('{"version":1,"seen":42,"history":[null,{}]}'), {
    getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); }
  }]) {
    const library = entries(6, 0);
    const rotation = create({ entries: library, storage, random: seeded(13) });
    const choices = library.map(() => next(rotation, library.map(entry => entry.key)).key);
    assert.equal(new Set(choices).size, library.length);
  }
});
