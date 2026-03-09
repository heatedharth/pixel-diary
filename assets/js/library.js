// ============================================================
// library.js — Game Library Page Logic
// Loads games, wires up the add/edit modal and delete confirm.
// Depends on: db.js, auth.js, games.js, ui.js
// ============================================================

// ── Protect page — redirect if not logged in ─────────────────
requireAuth("../pages/login.html");

// ── Load & Render Library ────────────────────────────────────
async function loadLibrary() {
    const user = getCurrentUser();
    if (!user) return;

    toggleLoadingSpinner(true);
    const games = await getGames(user.uid);
    toggleLoadingSpinner(false);
    renderGameGrid(games);
}

// ── Game Form Submit (Add or Edit) ───────────────────────────
document.getElementById("game-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    const form = e.currentTarget;
    const mode = form.dataset.mode;
    const gameId = form.dataset.gameId;

    const gameData = {
        title: document.getElementById("field-title").value.trim(),
        genre: document.getElementById("field-genre").value.trim(),
        platform: document.getElementById("field-platform").value.trim(),
        status: document.getElementById("field-status").value,
        hoursPlayed: parseFloat(document.getElementById("field-hours").value) || 0,
        coverURL: document.getElementById("field-cover").value.trim()
    };

    if (!gameData.title) {
        showToast("Game title is required!", "error");
        return;
    }

    if (mode === "edit") {
        const error = await updateGame(user.uid, gameId, gameData);
        if (error) {
            showToast("Error updating game: " + error, "error");
        } else {
            showToast("Game updated! ✨", "success");
            closeModal();
            loadLibrary();
        }
    } else {
        const { id, error } = await addGame(user.uid, gameData);
        if (error) {
            showToast("Error adding game: " + error, "error");
        } else {
            showToast("Game added! 🎮", "success");
            closeModal();
            loadLibrary();
        }
    }
});

// ── Modal close buttons ──────────────────────────────────────
document.getElementById("modal-close-btn").addEventListener("click", closeModal);
document.getElementById("modal-cancel-btn").addEventListener("click", closeModal);

// Close modal on backdrop click
document.getElementById("game-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ── Add Game button ──────────────────────────────────────────
document.getElementById("add-game-btn").addEventListener("click", () => {
    openModal("add");
});

// ── Delete Confirm ───────────────────────────────────────────
document.getElementById("confirm-delete-btn").addEventListener("click", async (e) => {
    const user = getCurrentUser();
    const gameId = e.currentTarget.dataset.id;

    const error = await deleteGame(user.uid, gameId);
    if (error) {
        showToast("Error deleting game: " + error, "error");
    } else {
        showToast("Game deleted.", "info");
        closeDeleteModal();
        loadLibrary();
    }
});

document.getElementById("cancel-delete-btn").addEventListener("click", closeDeleteModal);

document.getElementById("delete-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeDeleteModal();
});

// ── Initial load ─────────────────────────────────────────────
auth.onAuthStateChanged((user) => {
    if (user) loadLibrary();
});