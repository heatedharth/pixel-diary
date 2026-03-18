// ============================================================
// library.js — Game Library Page Logic
// Loads games, wires up the add/edit modal, delete confirm,
// and search/filter controls.
// Depends on: db.js, auth.js, games.js, ui.js, search-filter.js
// ============================================================

// ── Protect page — redirect if not logged in ─────────────────
requireAuth("../pages/login.html");

// ── Get user safely (fallback if cache not yet populated) ────
async function getAuthUser() {
    let user = getCurrentUser();
    if (user) return user;
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user) {
        _setCurrentUser(session.user);
        return getCurrentUser();
    }
    return null;
}

// ── Master games array (never re-fetched just to filter) ─────
let allGames = [];

// ── Load & Render Library ────────────────────────────────────
async function loadLibrary() {
    const user = await getAuthUser();
    if (!user) return;

    toggleLoadingSpinner(true);
    try {
        allGames = await getGames(user.uid);
        renderStats(allGames);
        populateGenreDropdown(allGames);
        applyFilters();
    } catch (err) {
        console.error("loadLibrary error:", err);
        showToast("Error loading library. Please refresh.", "error");
    } finally {
        toggleLoadingSpinner(false);
    }
}

// ── Render Stats Bar ─────────────────────────────────────────
function renderStats(games) {
    const total = games.length;
    const playing = games.filter(g => g.status === "playing").length;
    const played = games.filter(g => g.status === "played").length;
    const plan = games.filter(g => g.status === "plan-to-play").length;
    const favs = games.filter(g => g.favorite === true).length;

    document.getElementById("stat-total").textContent = total;
    document.getElementById("stat-playing").textContent = playing;
    document.getElementById("stat-played").textContent = played;
    document.getElementById("stat-plan").textContent = plan;
    document.getElementById("stat-fav").textContent = favs;

    const countEl = document.getElementById("game-count");
    if (countEl) countEl.textContent = total === 1 ? "1 game" : `${total} games`;
}

// ── Populate Genre Dropdown ───────────────────────────────────
function populateGenreDropdown(games) {
    const select = document.getElementById("filter-genre");
    const current = select.value;
    const genres = getUniqueGenres(games);

    select.innerHTML = `<option value="all">All Genres</option>`;
    genres.forEach(genre => {
        const opt = document.createElement("option");
        opt.value = genre;
        opt.textContent = genre;
        select.appendChild(opt);
    });

    if (genres.includes(current)) select.value = current;
}

// ── Apply Filters + Sort ──────────────────────────────────────
function applyFilters() {
    const query = document.getElementById("search-input").value;
    const genre = document.getElementById("filter-genre").value;
    const status = document.getElementById("filter-status").value;
    const sortKey = document.getElementById("sort-select").value;

    let result = combineFilters(allGames, { query, genre, status });
    result = applySort(result, sortKey);

    renderFilteredGrid(result);

    const hasFilters = query.trim() !== "" || genre !== "all" || status !== "all";
    document.getElementById("filter-clear-btn").style.display = hasFilters ? "inline-flex" : "none";
    document.getElementById("search-clear").style.display = query.trim() !== "" ? "flex" : "none";
}

// ── Render Filtered Grid ──────────────────────────────────────
function renderFilteredGrid(games) {
    const grid = document.getElementById("game-grid");
    const empty = document.getElementById("empty-state");
    const icon = document.getElementById("empty-icon");
    const message = document.getElementById("empty-message");

    grid.innerHTML = "";

    if (games.length === 0) {
        empty.style.display = "flex";
        if (allGames.length === 0) {
            icon.textContent = "🎮";
            message.textContent = "No games yet! Add your first game to get started.";
        } else {
            icon.textContent = "🔍";
            message.textContent = "No games match your search. Try different filters!";
        }
        return;
    }

    empty.style.display = "none";

    games.forEach(game => {
        const card = renderGameCard(game);

        card.querySelector(".card-fav").addEventListener("click", async (e) => {
            e.stopPropagation();
            const user = await getAuthUser();
            if (!user) return;
            const isFav = e.currentTarget.dataset.fav === "true";
            await toggleFavorite(user.uid, game.id, isFav);
            loadLibrary();
        });

        card.querySelector(".btn-edit").addEventListener("click", (e) => {
            e.stopPropagation();
            openModal("edit", game);
        });

        card.querySelector(".btn-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            openDeleteConfirm(game.id, game.title);
        });

        grid.appendChild(card);
    });
}

// ── Filter + Sort Event Listeners ────────────────────────────
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("filter-genre").addEventListener("change", applyFilters);
document.getElementById("filter-status").addEventListener("change", applyFilters);
document.getElementById("sort-select").addEventListener("change", applyFilters);

document.getElementById("search-clear").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    applyFilters();
    document.getElementById("search-input").focus();
});

document.getElementById("filter-clear-btn").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("filter-genre").value = "all";
    document.getElementById("filter-status").value = "all";
    document.getElementById("sort-select").value = "date";
    applyFilters();
});

// ── Game Form Submit (Add or Edit) ───────────────────────────
document.getElementById("game-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = await getAuthUser();
    if (!user) {
        showToast("Session expired. Please log in again.", "error");
        return;
    }

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
document.getElementById("game-modal").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// ── Add Game button ──────────────────────────────────────────
document.getElementById("add-game-btn").addEventListener("click", () => openModal("add"));

// ── Delete Confirm ───────────────────────────────────────────
document.getElementById("confirm-delete-btn").addEventListener("click", async (e) => {
    const user = await getAuthUser();
    if (!user) return;
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
// Only load on INITIAL_SESSION and SIGNED_IN to avoid
// multiple simultaneous loadLibrary() calls on token refresh
let libraryLoaded = false;
supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (!session?.user) return;
    _setCurrentUser(session.user);

    if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        libraryLoaded = false;
    }

    if (!libraryLoaded) {
        libraryLoaded = true;
        await loadLibrary();

        const params = new URLSearchParams(window.location.search);
        const editId = params.get("edit");
        if (editId) {
            const game = allGames.find(g => g.id === editId);
            if (game) openModal("edit", game);
            window.history.replaceState({}, "", window.location.pathname);
        }
    }
});