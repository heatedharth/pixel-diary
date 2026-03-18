// ============================================================
// sort.js — Sorting Logic
// Pure functions — no DOM, no Firestore.
// Each function takes an array of games and returns a new
// sorted array (original array is never mutated).
// Depends on: nothing
// ============================================================

// ── A → Z ────────────────────────────────────────────────────
function sortAZ(games) {
  return [...games].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  );
}

// ── Z → A ────────────────────────────────────────────────────
function sortZA(games) {
  return [...games].sort((a, b) =>
    b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
  );
}

// ── Most → Least Played (hours) ──────────────────────────────
function sortByMostPlayed(games) {
  return [...games].sort((a, b) => (b.hoursPlayed || 0) - (a.hoursPlayed || 0));
}

// ── Highest → Lowest Rating ──────────────────────────────────
function sortByRating(games) {
  return [...games].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

// ── By Genre (A → Z) ─────────────────────────────────────────
function sortByGenre(games) {
  return [...games].sort((a, b) => {
    const ga = a.genre || "";
    const gb = b.genre || "";
    return ga.localeCompare(gb, undefined, { sensitivity: "base" });
  });
}

// ── Newest → Oldest (date added) ─────────────────────────────
function sortByDateAdded(games) {
  return [...games].sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime() ?? 0;
    const tb = new Date(b.createdAt || 0).getTime() ?? 0;
    return tb - ta;
  });
}

// ── Apply Sort by Key ─────────────────────────────────────────
// Central dispatcher used by library.js applyFilters().
// "default" keeps Firestore order (newest first from query).
function applySort(games, sortKey) {
  switch (sortKey) {
    case "az": return sortAZ(games);
    case "za": return sortZA(games);
    case "most-played": return sortByMostPlayed(games);
    case "rating": return sortByRating(games);
    case "genre": return sortByGenre(games);
    case "date": return sortByDateAdded(games);
    default: return games;
  }
}