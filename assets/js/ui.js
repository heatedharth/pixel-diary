// ============================================================
// ui.js — Dynamic UI / DOM Rendering
// Renders game cards, manages the add/edit modal, and toasts.
// Depends on: games.js, db.js, auth.js
// ============================================================

// ── Render a Single Game Card ────────────────────────────────
function renderGameCard(game) {
    const card = document.createElement("div");
    card.classList.add("game-card");
    card.dataset.id = game.id;

    const statusClass = {
        "played": "badge-played",
        "playing": "badge-playing",
        "plan-to-play": "badge-plan"
    }[game.status] || "badge-plan";

    const statusLabel = {
        "played": "Played",
        "playing": "Playing",
        "plan-to-play": "Plan to Play"
    }[game.status] || "Plan to Play";

    const coverHTML = game.coverURL
        ? `<img src="${game.coverURL}" alt="${game.title} cover" class="card-cover" />`
        : `<div class="card-cover-placeholder">🎮</div>`;

    card.innerHTML = `
    ${coverHTML}
    <div class="card-body">
      <div class="card-top">
        <span class="card-badge ${statusClass}">${statusLabel}</span>
        <button class="card-fav ${game.favorite ? "active" : ""}" data-id="${game.id}" data-fav="${game.favorite}" title="Favorite">♥</button>
      </div>
      <h3 class="card-title">${game.title}</h3>
      <p class="card-genre">${game.genre || "No genre"}</p>
      <p class="card-platform">${game.platform || ""}</p>
      <div class="card-actions">
        <button class="card-btn btn-edit" data-id="${game.id}">Edit</button>
        <button class="card-btn btn-delete" data-id="${game.id}">Delete</button>
      </div>
    </div>
  `;

    return card;
}

// ── Render Full Game Grid ────────────────────────────────────
function renderGameGrid(games) {
    const grid = document.getElementById("game-grid");
    const empty = document.getElementById("empty-state");
    if (!grid) return;

    grid.innerHTML = "";

    if (games.length === 0) {
        if (empty) empty.style.display = "flex";
        return;
    }

    if (empty) empty.style.display = "none";

    games.forEach(game => {
        const card = renderGameCard(game);

        // Favorite toggle
        card.querySelector(".card-fav").addEventListener("click", async (e) => {
            e.stopPropagation();
            const uid = getCurrentUser().uid;
            const isFav = e.currentTarget.dataset.fav === "true";
            await toggleFavorite(uid, game.id, isFav);
            loadLibrary();
        });

        // Edit button
        card.querySelector(".btn-edit").addEventListener("click", (e) => {
            e.stopPropagation();
            openModal("edit", game);
        });

        // Delete button
        card.querySelector(".btn-delete").addEventListener("click", (e) => {
            e.stopPropagation();
            openDeleteConfirm(game.id, game.title);
        });

        grid.appendChild(card);
    });
}

// ── Toast Notification ───────────────────────────────────────
function showToast(message, type = "info") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast toast-${type} show`;
    setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Loading Spinner ──────────────────────────────────────────
function toggleLoadingSpinner(show) {
    const spinner = document.getElementById("spinner");
    if (spinner) spinner.style.display = show ? "flex" : "none";
}

// ── Modal: Open for Add or Edit ──────────────────────────────
function openModal(mode, game = null) {
    const modal = document.getElementById("game-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("game-form");

    // Set title
    modalTitle.textContent = mode === "edit" ? "Edit Game" : "Add Game";

    // Fill or clear fields
    document.getElementById("field-title").value = game?.title || "";
    document.getElementById("field-genre").value = game?.genre || "";
    document.getElementById("field-platform").value = game?.platform || "";
    document.getElementById("field-status").value = game?.status || "plan-to-play";
    document.getElementById("field-hours").value = game?.hoursPlayed || "";
    document.getElementById("field-cover").value = game?.coverURL || "";

    // Store edit target id
    form.dataset.mode = mode;
    form.dataset.gameId = game?.id || "";

    modal.classList.add("open");
}

// ── Modal: Close ─────────────────────────────────────────────
function closeModal() {
    const modal = document.getElementById("game-modal");
    modal.classList.remove("open");
}

// ── Delete Confirm Modal ─────────────────────────────────────
function openDeleteConfirm(gameId, title) {
    const modal = document.getElementById("delete-modal");
    const label = document.getElementById("delete-game-title");
    const confirmBtn = document.getElementById("confirm-delete-btn");

    label.textContent = `"${title}"`;
    confirmBtn.dataset.id = gameId;
    modal.classList.add("open");
}

function closeDeleteModal() {
    const modal = document.getElementById("delete-modal");
    modal.classList.remove("open");
}