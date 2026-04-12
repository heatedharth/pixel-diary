// ============================================================
// external-apis.js — RAWG + YouTube API helpers
// Depends on: supabase.config.js (RAWG_API_KEY, YOUTUBE_API_KEY)
// ============================================================

// ── RAWG: Search games ────────────────────────────────────────
async function rawgSearchGames(query) {
  if (!query || query.trim().length < 2) return [];

  const q = encodeURIComponent(query.trim());
  const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${q}&page_size=8`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`RAWG request failed (${res.status})`);
    const json = await res.json();
    const results = json.results || [];

    return results.map(g => ({
      id: g.id,
      title: g.name || "",
      coverURL: g.background_image || "",
      genre: (g.genres && g.genres[0] && g.genres[0].name) ? g.genres[0].name : "",
      platform: Array.isArray(g.platforms)
        ? g.platforms.map(p => p.platform?.name).filter(Boolean).join(", ")
        : "",
      released: g.released || ""
    }));
  } catch (err) {
    console.error("rawgSearchGames error:", err);
    return [];
  }
}

// ── YouTube: Find trailer ─────────────────────────────────────
async function fetchYouTubeTrailer(gameTitle) {
  if (!gameTitle || !gameTitle.trim()) return null;

  const query = encodeURIComponent(`${gameTitle} official trailer`);
  const endpoint =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet&type=video&maxResults=5&order=relevance` +
    `&q=${query}&key=${YOUTUBE_API_KEY}`;

  try {
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`YouTube request failed (${res.status})`);
    const json = await res.json();
    const items = json.items || [];

    if (items.length === 0) return null;

    const preferred =
      items.find(i => (i.snippet?.title || "").toLowerCase().includes("trailer")) ||
      items[0];

    return {
      videoId: preferred.id?.videoId || null,
      title: preferred.snippet?.title || ""
    };
  } catch (err) {
    console.error("fetchYouTubeTrailer error:", err);
    return null;
  }
}