// ============================================================
// app.js — App Entry Point
// Runs on every page. Manages auth state and navbar.
// Depends on: supabase.config.js, db.js, auth.js
// ============================================================

// ── Auth State Listener ───────────────────────────────────────
supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session?.user ?? null;
    _setCurrentUser(user);
    updateNavbar(user);
});

// ── Navbar Update ─────────────────────────────────────────────
function updateNavbar(user) {
    const loggedOutLinks = document.getElementById("nav-logged-out");
    const loggedInLinks = document.getElementById("nav-logged-in");
    const logoutBtn = document.getElementById("logout-btn");

    if (!loggedOutLinks || !loggedInLinks) return;

    if (user) {
        loggedOutLinks.style.display = "none";
        loggedInLinks.style.display = "flex";

        // Use onclick so repeated calls simply overwrite — no duplicate listeners,
        // no replaceWith racing issues
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                logOut();
            };
        }
    } else {
        loggedOutLinks.style.display = "flex";
        loggedInLinks.style.display = "none";
    }
}

// ── Page Protection ───────────────────────────────────────────
async function requireAuth(redirectPath = "../pages/login.html") {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = redirectPath;
    } else {
        _setCurrentUser(session.user);
    }
}