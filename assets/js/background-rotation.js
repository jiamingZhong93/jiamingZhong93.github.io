'use strict';

// Category weights control actual display frequency, independent of pool sizes.
// Each category completes its own shuffled no-repeat round. Only actual
// display consumes either a photograph or a weighted category slot.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BackgroundRotation = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const categories = ['experience', 'scenery'];
  const defaults = { experience: 1.5, scenery: 1 };
  const historyLimit = 36;

  function create({ entries, weights = defaults, storage, storageKey = 'homepage:background-rotation:v1', random = Math.random }) {
    const library = new Map();
    for (const entry of entries) {
      if (!entry || typeof entry.key !== 'string' || !entry.key || library.has(entry.key)) continue;
      const category = categories.includes(entry.category) ? entry.category : 'experience';
      const members = Array.isArray(entry.members) && entry.members.length
        ? [...new Set(entry.members.filter(member => typeof member === 'string' && member))] : [entry.key];
      library.set(entry.key, { key: entry.key, category, members: members.length ? members : [entry.key] });
    }
    const odds = Object.fromEntries(categories.map(category => {
      const value = weights[category];
      const numeric = value === undefined || value === null || value === '' ? defaults[category] : Number(value);
      return [category, Number.isFinite(numeric) && numeric >= 0 ? numeric : defaults[category]];
    }));
    const known = new Map(categories.map(category => [category, new Set(
      [...library.values()].filter(entry => entry.category === category).flatMap(entry => [entry.key, ...entry.members])
    )]));
    const seen = Object.fromEntries(categories.map(category => [category, new Set()]));
    // A bounded service balance keeps weighted categories mixed without long
    // random streaks. Persist it so refreshing cannot restart the preference.
    const progress = Object.fromEntries(categories.map(category => [category, 0]));
    const scale = Math.max(...Object.values(odds), 1);
    const shares = Object.fromEntries(categories.map(category => [category,
      odds[category] > 0 ? Math.max(Number.MIN_VALUE, odds[category] / scale) : 0
    ]));
    let history = [];
    let revision = 0;

    try {
      const saved = JSON.parse(storage?.getItem(storageKey) || 'null');
      if (saved?.version === 1) {
        for (const category of categories) {
          if (Array.isArray(saved.seen?.[category])) {
            for (const key of saved.seen[category].slice(-5000)) if (known.get(category).has(key)) seen[category].add(key);
          }
        }
        for (const category of categories) {
          const value = saved.progress?.[category];
          if (Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER) progress[category] = value;
        }
        if (Array.isArray(saved.history)) history = saved.history.slice(-historyLimit)
          .filter(item => item && typeof item.key === 'string' && Array.isArray(item.members))
          .map(item => ({ key: item.key, members: item.members.filter(member => typeof member === 'string' && [...known.values()].some(keys => keys.has(member))).slice(0, 50) }))
          .filter(item => item.members.length);
      }
    } catch {} // Private browsing, malformed old state, or unavailable storage.

    function shuffle(items) {
      const result = items.slice();
      for (let index = result.length - 1; index > 0; index--) {
        const swap = Math.floor(random() * (index + 1));
        [result[index], result[swap]] = [result[swap], result[index]];
      }
      return result;
    }
    const decks = Object.fromEntries(categories.map(category => [category,
      shuffle([...library.values()].filter(entry => entry.category === category))
    ]));
    const overlaps = (entry, old) => old && entry.members.some(member => old.members.includes(member));

    function enabled(eligibleKeys, exclude) {
      return [...new Set(eligibleKeys)].map(key => library.get(key))
        .filter(entry => entry && entry.key !== exclude && odds[entry.category] > 0);
    }

    function chooseCategory(available) {
      if (available.length === 1) return available[0];
      let selected;
      let earliest = Infinity;
      for (const category of available) {
        // Randomize the next service slot within one interval. A larger weight
        // gives more slots, rather than just an earlier spot in a global round.
        const position = (progress[category] + random()) / shares[category];
        if (position < earliest) {
          earliest = position;
          selected = category;
        }
      }
      return selected || available[0];
    }

    function peek(eligibleKeys, { exclude } = {}) {
      const candidates = enabled(eligibleKeys, exclude);
      if (!candidates.length) return null;
      const pools = {};
      const resets = {};
      for (const category of categories) {
        const pool = candidates.filter(entry => entry.category === category);
        const fresh = pool.filter(entry => entry.members.some(member => !seen[category].has(member)));
        resets[category] = !fresh.length;
        pools[category] = fresh.length ? fresh : pool;
      }
      // Avoid repeating the same scene across reloads and desktop/mobile groups
      // whenever an alternative exists, without losing an unseen group member.
      const different = Object.values(pools).flat().filter(entry => !overlaps(entry, history.at(-1)));
      if (different.length) {
        const differentKeys = new Set(different.map(entry => entry.key));
        for (const category of categories) pools[category] = pools[category].filter(entry => differentKeys.has(entry.key));
      }
      const available = categories.filter(category => pools[category].length);
      const category = chooseCategory(available);
      const reset = resets[category];
      let choices = pools[category];
      if (!reset) {
        const entirelyFresh = choices.filter(entry => entry.members.every(member => !seen[category].has(member)));
        if (entirelyFresh.length) choices = entirelyFresh;
      }
      // A group and its mobile single photos share member IDs. Prefer material
      // absent from recent slides within the selected category.
      const recent = history.slice(-6);
      const rested = choices.filter(entry => !recent.some(old => overlaps(entry, old)));
      if (rested.length) choices = rested;
      const choiceKeys = new Set(choices.map(entry => entry.key));
      const deck = reset ? shuffle(pools[category]) : decks[category];
      const selected = deck.find(entry => choiceKeys.has(entry.key));
      return selected ? { key: selected.key, category, reset, revision, available } : null;
    }

    function commit(choice) {
      const entry = library.get(typeof choice === 'string' ? choice : choice?.key);
      if (!entry) return false;
      // Resizing into the same scene can commit a plain key. It records what was
      // shown without resetting a cycle or consuming a speculative next choice.
      if (choice?.reset && choice.revision === revision) {
        seen[entry.category].clear();
        decks[entry.category] = shuffle(decks[entry.category]);
      }
      // Only a displayed, current selection consumes a category slot. A resize
      // that maps a group to its member records the image without skewing odds.
      // If only one category can be shown, do not accumulate catch-up debt.
      if (choice?.revision === revision && choice.available?.length > 1) {
        progress[entry.category]++;
        const baseline = Math.min(...choice.available.map(category => progress[category] / shares[category]));
        for (const category of choice.available) progress[category] = Math.max(0, progress[category] - baseline * shares[category]);
      }
      seen[entry.category].add(entry.key);
      for (const member of entry.members) seen[entry.category].add(member);
      history.push({ key: entry.key, members: entry.members });
      history = history.slice(-historyLimit);
      revision++;
      try {
        storage?.setItem(storageKey, JSON.stringify({ version: 1,
          seen: Object.fromEntries(categories.map(category => [category, [...seen[category]]])), history, progress
        }));
      } catch {} // Continue the same no-repeat cycle in memory if persistence fails.
      return true;
    }

    return { peek, commit, hasNext: (eligibleKeys, { exclude } = {}) => enabled(eligibleKeys, exclude).length > 0 };
  }
  return { create };
});
