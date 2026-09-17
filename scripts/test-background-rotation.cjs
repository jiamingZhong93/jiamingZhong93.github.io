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

function longestRun(sequence) {
  let longest = 0;
  let run = 0;
  sequence.forEach((category, i) => {
    run = category === sequence[i - 1] ? run + 1 : 1;
    longest = Math.max(longest, run);
  });
  return longest;
}

test('category frequency is 60:40 for unequal desktop and mobile pools, with varied spacing', () => {
  for (const [experience, scenery] of [[10, 34], [31, 40]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const orders = new Set();
    for (let seed = 1; seed <= 50; seed++) {
      const rotation = create({ entries: library, random: seeded(seed) });
      const sequence = [];
      let previous;
      for (let i = 0; i < 600; i++) {
        const choice = next(rotation, keys, previous);
        assert.notEqual(choice.key, previous);
        sequence.push(choice.category);
        previous = choice.key;
      }
      const workCount = sequence.filter(category => category === 'experience').length;
      assert.ok(Math.abs(workCount - 360) <= 1, `expected about 360 work photos, got ${workCount}`);
      assert.ok(longestRun(sequence) <= 4, 'categories should remain interleaved');
      orders.add(sequence.slice(0, 40).join(','));
    }
    assert.ok(orders.size > 40, 'the category order must retain random variation');
  }
});

test('each category visits every eligible slide before repeating independently', () => {
  for (const [experience, scenery] of [[10, 34], [31, 40]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const rotation = create({ entries: library, random: seeded(21) });
    const visited = { experience: new Set(), scenery: new Set() };
    const counts = { experience: 0, scenery: 0 };
    const sizes = { experience, scenery };
    let previous;
    while (counts.experience < experience * 2 || counts.scenery < scenery * 2) {
      const choice = next(rotation, keys, previous);
      const category = choice.category;
      const newRound = counts[category] > 0 && counts[category] % sizes[category] === 0;
      assert.equal(choice.reset, newRound);
      if (newRound) {
        assert.equal(visited[category].size, sizes[category]);
        visited[category].clear();
      }
      assert.equal(visited[category].has(choice.key), false, 'photo repeated inside its category round');
      assert.notEqual(choice.key, previous);
      visited[category].add(choice.key);
      counts[category]++;
      previous = choice.key;
    }
  }
});

test('weights control actual counts and only relative values matter, including huge finite weights', () => {
  const library = entries(11, 10);
  const keys = library.map(entry => entry.key);
  function sequence(weights) {
    const rotation = create({ entries: library, weights, random: seeded(23) });
    return Array.from({ length: 500 }, () => next(rotation, keys).category);
  }
  const equal = sequence({ experience: 1, scenery: 1 });
  const preferred = sequence({ experience: 1, scenery: 4 });
  const huge = sequence({ experience: 4e307, scenery: 1.6e308 });
  assert.ok(Math.abs(equal.filter(category => category === 'scenery').length - 250) <= 1);
  assert.ok(Math.abs(preferred.filter(category => category === 'scenery').length - 400) <= 1);
  assert.deepEqual(huge, preferred, 'only relative weights should matter');
});

test('reloading each slide preserves both category frequency and independent no-repeat progress', () => {
  for (const [experience, scenery] of [[10, 34], [31, 40]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const storage = memory();
    const counts = { experience: 0, scenery: 0 };
    const sizes = { experience, scenery };
    const visited = { experience: new Set(), scenery: new Set() };
    let previous;
    for (let reload = 0; reload < 500; reload++) {
      const rotation = create({ entries: library, storage, random: seeded(30 + reload) });
      const choice = next(rotation, keys);
      const category = choice.category;
      const newRound = counts[category] > 0 && counts[category] % sizes[category] === 0;
      assert.equal(choice.reset, newRound);
      if (newRound) visited[category].clear();
      assert.equal(visited[category].has(choice.key), false);
      assert.notEqual(choice.key, previous);
      visited[category].add(choice.key);
      counts[category]++;
      previous = choice.key;
    }
    assert.ok(Math.abs(counts.experience - 300) <= 1, 'refresh must not restart category preference');
  }
});

test('strong custom frequency weights retain their balance across page reloads', () => {
  const library = entries(8, 12);
  const keys = library.map(entry => entry.key);
  const storage = memory();
  let work = 0;
  for (let reload = 0; reload < 1000; reload++) {
    const rotation = create({ entries: library, storage, weights: { experience: 9, scenery: 1 }, random: seeded(300 + reload) });
    if (next(rotation, keys).category === 'experience') work++;
  }
  assert.ok(Math.abs(work - 900) <= 1);
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

test('a speculative category reset changes no state and its commit preserves the other category', () => {
  const library = entries(3, 4);
  const keys = library.map(entry => entry.key);
  const storage = memory();
  const rotation = create({ entries: library, storage, random: seeded(17) });
  for (const entry of library) rotation.commit(entry.key);
  const saved = storage.getItem();
  const speculative = rotation.peek(keys);
  assert.equal(speculative.reset, true);
  assert.equal(storage.getItem(), saved);
  const replacement = rotation.peek(keys.filter(key => key !== speculative.key));
  assert.equal(replacement.reset, true);
  assert.equal(storage.getItem(), saved);
  rotation.commit(replacement);
  const state = JSON.parse(storage.getItem());
  assert.deepEqual(state.seen[replacement.category], [replacement.key]);
  const other = replacement.category === 'experience' ? 'scenery' : 'experience';
  assert.deepEqual(state.seen[other], JSON.parse(saved).seen[other]);
  assert.ok(Object.values(state.progress).some(value => value > 0), 'display should consume the weighted slot');
});

test('old version-one global-round histories survive migration to category rounds', () => {
  const library = entries(2, 3);
  const storage = memory(JSON.stringify({ version: 1,
    seen: { experience: ['experience-0', 'experience-1'], scenery: ['scenery-0'] },
    history: [{ key: 'experience-1', members: ['experience-1'] }]
  }));
  const rotation = create({ entries: library, storage, random: seeded(19) });
  const scenicKeys = library.filter(entry => entry.category === 'scenery').map(entry => entry.key);
  const first = next(rotation, scenicKeys);
  const second = next(rotation, scenicKeys);
  assert.deepEqual([first.key, second.key].sort(), ['scenery-1', 'scenery-2']);
  assert.equal(first.reset, false);
  assert.equal(second.reset, false);
  assert.equal(rotation.peek(scenicKeys).reset, true);
  assert.deepEqual(JSON.parse(storage.getItem()).seen.experience, ['experience-0', 'experience-1']);
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

test('a partly viewed group shows its unseen member before that category resets', () => {
  const library = [
    { key: 'a', category: 'experience' }, { key: 'b', category: 'experience' },
    { key: 'c', category: 'experience' },
    { key: 'group-ab', members: ['a', 'b'], category: 'experience' }
  ];
  const rotation = create({ entries: library, random: seeded(20) });
  rotation.commit('a');
  const desktop = ['group-ab', 'c'];
  assert.equal(next(rotation, desktop).key, 'c');
  rotation.commit('a');
  const group = next(rotation, desktop);
  assert.equal(group.key, 'group-ab');
  assert.equal(group.reset, false);
  const nextRound = rotation.peek(desktop, { exclude: group.key });
  assert.equal(nextRound.key, 'c');
  assert.equal(nextRound.reset, true);
});

test('adding a new member to a previously viewed group does not skip that member', () => {
  const storage = memory();
  const previous = create({ entries: [{ key: 'group', members: ['a', 'b'], category: 'experience' }], storage });
  previous.commit('group');
  const updated = create({ entries: [{ key: 'group', members: ['a', 'b', 'new'], category: 'experience' }], storage });
  const choice = updated.peek(['group']);
  assert.equal(choice.key, 'group');
  assert.equal(choice.reset, false);
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

test('each category uses its current viewport pool without a speculative reset hiding new photos', () => {
  const library = entries(4, 5);
  const keys = library.map(entry => entry.key);
  const narrow = ['experience-0', 'experience-1', 'scenery-0', 'scenery-1'];
  const rotation = create({ entries: library, random: seeded(24) });
  for (const key of narrow) rotation.commit(key);
  assert.equal(rotation.peek(narrow).reset, true);
  for (const category of ['experience', 'scenery']) {
    const categoryKeys = keys.filter(key => key.startsWith(category));
    const hidden = categoryKeys.filter(key => !narrow.includes(key));
    const revealed = new Set();
    for (let i = 0; i < hidden.length; i++) {
      const choice = next(rotation, categoryKeys);
      assert.equal(choice.reset, false);
      assert.ok(hidden.includes(choice.key));
      assert.equal(revealed.has(choice.key), false);
      revealed.add(choice.key);
    }
    assert.equal(rotation.peek(categoryKeys).reset, true);
  }
});

test('temporary single-category availability does not create catch-up bursts on resize', () => {
  const library = entries(6, 9);
  const keys = library.map(entry => entry.key);
  const rotation = create({ entries: library, random: seeded(25) });
  const onlyWork = keys.filter(key => key.startsWith('experience'));
  for (let i = 0; i < 200; i++) next(rotation, onlyWork);
  const sequence = Array.from({ length: 100 }, () => next(rotation, keys).category);
  assert.ok(Math.abs(sequence.filter(category => category === 'experience').length - 60) <= 1);
  assert.ok(longestRun(sequence) <= 3);
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
