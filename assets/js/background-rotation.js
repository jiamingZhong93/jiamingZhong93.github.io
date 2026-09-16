'use strict';

// Unseen photos take priority across the whole library. Randomized category
// spacing keeps work and scenery interleaved throughout each round; weights
// give a modest earlier-position preference. Only actual display counts.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BackgroundRotation = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  const categories = ['experience', 'scenery'];
  const defaults = { experience: 2, scenery: 1 };
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

    function chooseCategory(candidates, eligibleKeys, reset) {
      const available = categories.filter(category => candidates.some(entry => entry.category === category));
      if (available.length === 1) return available[0];
      // Compare the next randomized slot in each category's progress through the
      // round. Dividing by its own pool size spreads even a small work collection
      // across a large scenery collection instead of spending it all up front.
      // Include the current (excluded) slide in this denominator, and reconstruct
      // progress from seen members so refreshing cannot restart the spacing.
      const pool = enabled(eligibleKeys);
      const scale = Math.max(...available.map(category => odds[category]));
      let selected;
      let earliest = Infinity;
      for (const category of available) {
        const categoryPool = pool.filter(entry => entry.category === category);
        const displayed = reset ? 0 : categoryPool.filter(entry =>
          entry.members.every(member => seen[category].has(member))).length;
        const other = available.find(value => value !== category);
        // A bounded fraction of one slot expresses weight preference without
        // letting even extreme weights defeat interleaving or no-repeat rounds.
        const preference = .4 * (odds[category] / scale - odds[other] / scale);
        const position = (displayed + random() - preference) / categoryPool.length;
        if (position < earliest) {
          earliest = position;
          selected = category;
        }
      }
      return selected;
    }

    function peek(eligibleKeys, { exclude } = {}) {
      let candidates = enabled(eligibleKeys, exclude);
      if (!candidates.length) return null;
      // Finish all eligible material before either category starts another round.
      // A partly viewed desktop group still has something new to show after a
      // layout change. Its group key must not hide a newly added member either.
      const fresh = candidates.filter(entry => entry.members.some(member => !seen[entry.category].has(member)));
      const reset = !fresh.length;
      if (!reset) candidates = fresh;
      // Freshness comes first: avoiding a shared member must not trigger a reset
      // while a partly viewed group is the only remaining unseen material.
      const different = candidates.filter(entry => !overlaps(entry, history.at(-1)));
      if (different.length) candidates = different;
      if (!reset) {
        const entirelyFresh = candidates.filter(entry => entry.members.every(member => !seen[entry.category].has(member)));
        if (entirelyFresh.length) candidates = entirelyFresh;
      }
      const category = chooseCategory(candidates, eligibleKeys, reset);
      const categoryEntries = candidates.filter(entry => entry.category === category);
      let choices = categoryEntries;
      // A group and its mobile single photos share member IDs. Prefer material
      // absent from recent slides within the selected category.
      const recent = history.slice(-6);
      const rested = choices.filter(entry => !recent.some(old => overlaps(entry, old)));
      if (rested.length) choices = rested;
      const choiceKeys = new Set(choices.map(entry => entry.key));
      const deck = reset ? shuffle(categoryEntries) : decks[category];
      const selected = deck.find(entry => choiceKeys.has(entry.key));
      return selected ? { key: selected.key, category, reset, revision } : null;
    }

    function commit(choice) {
      const entry = library.get(typeof choice === 'string' ? choice : choice?.key);
      if (!entry) return false;
      // Resizing into the same scene can commit a plain key. It records what was
      // shown without resetting a cycle or consuming a speculative next choice.
      if (choice?.reset && choice.revision === revision) {
        for (const category of categories) {
          seen[category].clear();
          decks[category] = shuffle(decks[category]);
        }
      }
      seen[entry.category].add(entry.key);
      for (const member of entry.members) seen[entry.category].add(member);
      history.push({ key: entry.key, members: entry.members });
      history = history.slice(-historyLimit);
      revision++;
      try {
        storage?.setItem(storageKey, JSON.stringify({ version: 1,
          seen: Object.fromEntries(categories.map(category => [category, [...seen[category]]])), history
        }));
      } catch {} // Continue the same no-repeat cycle in memory if persistence fails.
      return true;
    }

    return { peek, commit, hasNext: (eligibleKeys, { exclude } = {}) => enabled(eligibleKeys, exclude).length > 0 };
  }
  return { create };
});
