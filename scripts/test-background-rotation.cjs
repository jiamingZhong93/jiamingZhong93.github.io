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

test('unequal desktop and mobile pools interleave through the whole no-repeat round', () => {
  for (const [experience, scenery, maxRun] of [[10, 34, 8], [31, 40, 4]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const categoryOrders = new Set();
    const gaps = new Set();
    for (let seed = 1; seed <= 100; seed++) {
      const rotation = create({ entries: library, random: seeded(seed) });
      const shown = new Set();
      const sequence = [];
      let previous;
      let lastWork = -1;
      for (let i = 0; i < keys.length; i++) {
        const choice = next(rotation, keys, previous);
        assert.equal(choice.reset, false);
        assert.equal(shown.has(choice.key), false);
        shown.add(choice.key);
        sequence.push(choice.category);
        if (choice.category === 'experience') {
          if (lastWork >= 0) gaps.add(i - lastWork);
          lastWork = i;
        }
        previous = choice.key;
      }
      assert.ok(lastWork >= keys.length * .75, 'work photos were exhausted before the final quarter');
      assert.ok(longestRun(sequence) <= maxRun, `unmixed ${experience}:${scenery} round: ${sequence}`);
      assert.equal(shown.size, keys.length);
      categoryOrders.add(sequence.join(','));
    }
    assert.ok(categoryOrders.size > 90, 'categories should not follow a fixed repeated schedule');
    assert.ok(gaps.size >= 3, 'work/scenery gaps should vary, not alternate mechanically');
  }
});

test('desktop and mobile libraries visit every slide before repeating for two complete rounds', () => {
  for (const [experience, scenery] of [[10, 34], [31, 40]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const rotation = create({ entries: library, random: seeded(21) });
    let previous;
    for (let round = 0; round < 2; round++) {
      const seen = new Set();
      for (let i = 0; i < keys.length; i++) {
        const choice = next(rotation, keys, previous);
        assert.equal(choice.reset, round > 0 && i === 0);
        assert.equal(seen.has(choice.key), false, `${experience}:${scenery} repeated ${choice.key}`);
        assert.notEqual(choice.key, previous, 'round boundary repeated the last slide');
        seen.add(choice.key);
        previous = choice.key;
      }
      assert.deepEqual([...seen].sort(), [...keys].sort());
    }
  }
});

test('weights prefer earlier positions while preserving interleaving, including large finite values', () => {
  const library = entries(11, 10);
  const keys = library.map(entry => entry.key);
  function averagePosition(weights) {
    const random = seeded(23);
    let positions = 0;
    let first = 0;
    for (let i = 0; i < 1000; i++) {
      const rotation = create({ entries: library, weights, random });
      const sequence = keys.map((key, index) => {
        const choice = next(rotation, keys);
        if (choice.category === 'scenery') {
          positions += index;
          if (index === 0) first++;
        }
        return choice.category;
      });
      assert.ok(sequence.slice(-5).includes('experience'));
      assert.ok(sequence.slice(-5).includes('scenery'));
      assert.ok(longestRun(sequence) <= 3);
    }
    return { position: positions / 10000, first: first / 1000 };
  }
  const equal = averagePosition({ experience: 1, scenery: 1 });
  const preferred = averagePosition({ experience: 1, scenery: 4 });
  const huge = averagePosition({ experience: 4e307, scenery: 1.6e308 });
  assert.ok(preferred.position < equal.position - .4, 'higher weight should move a category forward');
  assert.ok(preferred.first > equal.first + .2);
  assert.ok(preferred.first < .99, 'weight preference should still allow either category to start');
  assert.deepEqual(huge, preferred, 'only relative weights should matter');
});

test('both actual library sizes complete two global rounds even when every slide follows a reload', () => {
  for (const [experience, scenery] of [[10, 34], [31, 40]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    const storage = memory();
    let previous;
    for (let round = 0; round < 2; round++) {
      const seen = new Set();
      for (let reload = 0; reload < keys.length; reload++) {
        const rotation = create({ entries: library, storage, random: seeded(30 + reload + round * keys.length) });
        const choice = next(rotation, keys);
        assert.equal(choice.reset, round > 0 && reload === 0);
        assert.equal(seen.has(choice.key), false, 'refresh repeated before global exhaustion');
        assert.notEqual(choice.key, previous);
        seen.add(choice.key);
        previous = choice.key;
      }
      assert.equal(seen.size, keys.length);
    }
  }
});

test('refreshing every slide preserves category spacing rather than front-loading work again', () => {
  for (const [experience, scenery, maxRun] of [[10, 34, 8], [31, 40, 4]]) {
    const library = entries(experience, scenery);
    const keys = library.map(entry => entry.key);
    for (let seed = 1; seed <= 30; seed++) {
      const storage = memory();
      const sequence = [];
      const shown = new Set();
      for (let reload = 0; reload < keys.length; reload++) {
        const rotation = create({ entries: library, storage, random: seeded(seed * 100 + reload) });
        const choice = next(rotation, keys);
        assert.equal(shown.has(choice.key), false);
        shown.add(choice.key);
        sequence.push(choice.category);
      }
      assert.ok(sequence.lastIndexOf('experience') >= keys.length * .75);
      assert.ok(longestRun(sequence) <= maxRun, `refresh produced a long same-category run: ${sequence}`);
    }
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

test('a speculative new round does not clear either category until it is displayed', () => {
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
  assert.deepEqual(state.seen[replacement.category === 'experience' ? 'scenery' : 'experience'], []);
  const shown = new Set([replacement.key]);
  for (let i = 1; i < keys.length; i++) {
    const choice = next(rotation, keys);
    assert.equal(choice.reset, false);
    assert.equal(shown.has(choice.key), false);
    shown.add(choice.key);
  }
  assert.ok(shown.has(speculative.key), 'cancelled new-round candidate must remain available');
});

test('existing version-one category histories are retained when moving to global rounds', () => {
  const library = entries(2, 3);
  const storage = memory(JSON.stringify({ version: 1,
    seen: { experience: ['experience-0', 'experience-1'], scenery: ['scenery-0'] },
    history: [{ key: 'experience-1', members: ['experience-1'] }]
  }));
  const rotation = create({ entries: library, storage, random: seeded(19) });
  const keys = library.map(entry => entry.key);
  const first = next(rotation, keys);
  const second = next(rotation, keys);
  assert.deepEqual([first.key, second.key].sort(), ['scenery-1', 'scenery-2']);
  assert.equal(first.reset, false);
  assert.equal(second.reset, false);
  assert.equal(rotation.peek(keys).reset, true);
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

test('a partly viewed group shows its unseen member before any global reset', () => {
  const library = [
    { key: 'a', category: 'experience' }, { key: 'b', category: 'experience' },
    { key: 'c', category: 'scenery' },
    { key: 'group-ab', members: ['a', 'b'], category: 'experience' }
  ];
  const rotation = create({ entries: library, random: seeded(20) });
  rotation.commit('a');
  const desktop = ['group-ab', 'c'];
  // Prefer an entirely new scene while it is available.
  assert.equal(next(rotation, desktop).key, 'c');
  // A resize can re-display a; overlapping it must not hide the unseen b.
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

test('rounds use the current viewport pool and uncommitted resets cannot hide newly eligible photos', () => {
  const library = entries(4, 5);
  const keys = library.map(entry => entry.key);
  const narrow = ['experience-0', 'experience-1', 'scenery-0', 'scenery-1'];
  const hidden = keys.filter(key => !narrow.includes(key));
  const rotation = create({ entries: library, random: seeded(24) });
  for (let i = 0; i < narrow.length; i++) {
    const choice = next(rotation, narrow);
    assert.equal(choice.reset, false);
  }
  // Ineligible photos do not prevent a narrow-screen round from completing.
  assert.equal(rotation.peek(narrow).reset, true);
  const revealed = new Set();
  for (let i = 0; i < hidden.length; i++) {
    const choice = next(rotation, keys);
    assert.equal(choice.reset, false, 'a cancelled narrow-screen preload must not reset the full pool');
    assert.ok(hidden.includes(choice.key));
    assert.equal(revealed.has(choice.key), false);
    revealed.add(choice.key);
  }
  assert.equal(rotation.peek(keys).reset, true);
  // If the smaller pool actually starts a new round, it still completes that
  // round independently of photographs which cannot be displayed there.
  const first = next(rotation, narrow);
  assert.equal(first.reset, true);
  const nextRound = new Set([first.key]);
  for (let i = 1; i < narrow.length; i++) {
    const choice = next(rotation, narrow);
    assert.equal(choice.reset, false);
    assert.equal(nextRound.has(choice.key), false);
    nextRound.add(choice.key);
  }
  assert.equal(nextRound.size, narrow.length);
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
