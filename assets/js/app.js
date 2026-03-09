// ============================================================
// app.js — App Entry Point
// Runs on every page. Handles auth state and navbar updates.
// Depends on: db.js, auth.js
// ============================================================

// ── Auth State Listener ─────────────────────────────────────
// Fires whenever the user logs in or out.
// Updates the navbar to show the right links.
auth.onAuthStateChanged((user) => {
    updateNavbar(user);
});

// ── Navbar Update ───────────────────────────────────────────
function updateNavbar(user) {
    const loggedOutLinks = document.getElementById("nav-logged-out");
    const loggedInLinks = document.getElementById("nav-logged-in");
    const logoutBtn = document.getElementById("logout-btn");

    if (!loggedOutLinks || !loggedInLinks) return;

    if (user) {
        // User is signed in — show library/profile/logout
        loggedOutLinks.style.display = "none";
        loggedInLinks.style.display = "flex";

        // Wire up logout button
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => logOut());
        }
    } else {
        // User is signed out — show login/signup
        loggedOutLinks.style.display = "flex";
        loggedInLinks.style.display = "none";
    }
}

// ── Page Protection ─────────────────────────────────────────
// Call this on any page that requires login.
// Redirects to login if not authenticated.
function requireAuth(redirectPath = "../pages/login.html") {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = redirectPath;
        }
    });
}