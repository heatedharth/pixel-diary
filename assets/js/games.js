// ============================================================
// games.js — Game CRUD Operations (Supabase)
// All reads/writes to the games table.
// Depends on: supabase.config.js (supabaseClient)
// ============================================================

// ── Add Game ─────────────────────────────────────────────────
async function addGame(uid, gameData) {
    const { data, error } = await supabaseClient
        .from("games")
        .insert({
            userId: uid,
            ...gameData,
            favorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })
        .select()
        .single();

    if (error) return { id: null, error: error.message };
    return { id: data.id, error: null };
}

// ── Get All Games ─────────────────────────────────────────────
async function getGames(uid) {
    const { data, error } = await supabaseClient
        .from("games")
        .select("*")
        .eq("userId", uid)
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("getGames error:", error.message);
        return [];
    }
    return data;
}

// ── Get Single Game ───────────────────────────────────────────
async function getGameById(uid, gameId) {
    const { data, error } = await supabaseClient
        .from("games")
        .select("*")
        .eq("userId", uid)
        .eq("id", gameId)
        .single();

    if (error) {
        console.error("getGameById error:", error.message);
        return null;
    }
    return data;
}

// ── Update Game ───────────────────────────────────────────────
async function updateGame(uid, gameId, updatedData) {
    const { error } = await supabaseClient
        .from("games")
        .update({ ...updatedData, updatedAt: new Date().toISOString() })
        .eq("id", gameId)
        .eq("userId", uid);

    return error ? error.message : null;
}

// ── Delete Game ───────────────────────────────────────────────
async function deleteGame(uid, gameId) {
    const { error } = await supabaseClient
        .from("games")
        .delete()
        .eq("id", gameId)
        .eq("userId", uid);

    return error ? error.message : null;
}

// ── Toggle Favorite ───────────────────────────────────────────
async function toggleFavorite(uid, gameId, currentValue) {
    const { error } = await supabaseClient
        .from("games")
        .update({ favorite: !currentValue, updatedAt: new Date().toISOString() })
        .eq("id", gameId)
        .eq("userId", uid);

    return error ? error.message : null;
}

// ── Update Play Status ────────────────────────────────────────
async function updatePlayStatus(uid, gameId, status) {
    const { error } = await supabaseClient
        .from("games")
        .update({ status, updatedAt: new Date().toISOString() })
        .eq("id", gameId)
        .eq("userId", uid);

    return error ? error.message : null;
}