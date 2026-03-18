// ============================================================
// search-filter.js — Search and Filter Logic
// Pure functions — no DOM, no Firestore.
// Takes an array of game objects, returns a filtered array.
// Depends on: nothing
// ============================================================

// ── Search by title ──────────────────────────────────────────
// Case-insensitive substring match on game title
function searchGames(games, query) {
  if (!query || query.trim() === "") return games;
  const q = query.trim().toLowerCase();
  return games.filter(g => g.title.toLowerCase().includes(q));
}

// ── Filter by genre ──────────────────────────────────────────
// "all" or empty string returns everything
function filterByGenre(games, genre) {
  if (!genre || genre === "all") return games;
  return games.filter(g =>
    g.genre && g.genre.toLowerCase() === genre.toLowerCase()
  );
}

// ── Filter by status ─────────────────────────────────────────
// "all" or empty string returns everything
function filterByStatus(games, status) {
  if (!status || status === "all") return games;
  return games.filter(g => g.status === status);
}

// ── Combine all filters ──────────────────────────────────────
// Pass the full games array and an object with any combination
// of { query, genre, status }. Filters are applied in sequence.
function combineFilters(games, { query = "", genre = "all", status = "all" } = {}) {
  let result = games;
  result = searchGames(result, query);
  result = filterByGenre(result, genre);
  result = filterByStatus(result, status);
  return result;
}

// ── Build unique genre list ──────────────────────────────────
// Extracts sorted unique genres from the games array.
// Used to populate the genre dropdown dynamically.
function getUniqueGenres(games) {
  const genres = games
    .map(g => g.genre)
    .filter(g => g && g.trim() !== "");
  return [...new Set(genres)].sort();
}
