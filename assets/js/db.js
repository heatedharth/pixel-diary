// ============================================================
// db.js — Supabase Initialization & Shared Helpers
// supabase.config.js must be loaded before this file.
// All other JS files depend on this file.
// ============================================================

// ── Cached current user ───────────────────────────────────────
// Set by app.js onAuthStateChange. Other files call getCurrentUser().
let _currentUser = null;

function getCurrentUser() {
    // Return user with .uid alias so all existing code works unchanged
    return _currentUser ? { ..._currentUser, uid: _currentUser.id } : null;
}

function _setCurrentUser(user) {
    _currentUser = user;
}