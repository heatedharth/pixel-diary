// ============================================================
// game-detail.js — Game Detail Page Logic
// Loads one game, renders all info, handles review add/edit/delete.
// Depends on: db.js, auth.js, games.js, reviews.js, app.js
// ============================================================

// ── Protect page ─────────────────────────────────────────────
requireAuth("login.html");

// ── Read game ID from URL (?id=GAMEID) ───────────────────────
const params = new URLSearchParams(window.location.search);
const gameId = params.get("id");

if (!gameId) window.location.href = "library.html";

// ── State ─────────────────────────────────────────────────────
let currentGame = null;
let selectedRating = 0;

// ── Load and render the game ──────────────────────────────────
async function loadGame() {
  const user = getCurrentUser();
  if (!user) return;

  currentGame = await getGameById(user.uid, gameId);
  if (!currentGame) {
    window.location.href = "library.html";
    return;
  }

  renderHero(currentGame);
  renderReviewSection(currentGame);
  renderMediaGallery(currentGame);
}

// ── Render hero section ───────────────────────────────────────
function renderHero(game) {
  // Cover
  const coverEl = document.getElementById("detail-cover");
  if (game.coverURL) {
    coverEl.innerHTML = `<img src="${game.coverURL}" alt="${game.title}" class="detail-cover" />`;
  } else {
    coverEl.innerHTML = `<div class="detail-cover-placeholder">🎮</div>`;
  }

  // Title
  document.getElementById("detail-title").textContent = game.title;
  document.title = `${game.title} — Pixel Diary`;

  // Meta tags
  const meta = document.getElementById("detail-meta");
  const statusLabel = { "played": "Played", "playing": "Playing", "plan-to-play": "Plan to Play" }[game.status] || "Plan to Play";
  const statusClass = { "played": "badge-played", "playing": "badge-playing", "plan-to-play": "badge-plan" }[game.status] || "badge-plan";

  meta.innerHTML = `
    <span class="detail-badge card-badge ${statusClass}">${statusLabel}</span>
    ${game.genre ? `<span class="detail-genre-tag">${game.genre}</span>` : ""}
    ${game.platform ? `<span class="detail-platform-tag">${game.platform}</span>` : ""}
    ${game.hoursPlayed ? `<span class="detail-hours">⏱ ${game.hoursPlayed}h played</span>` : ""}
  `;

  // Star display
  document.getElementById("detail-stars").innerHTML = renderStarDisplay(game.rating);

  // Favourite button
  const favBtn = document.getElementById("detail-fav-btn");
  favBtn.classList.toggle("active", !!game.favorite);
  favBtn.title = game.favorite ? "Remove from favourites" : "Add to favourites";
}

// ── Render review section ─────────────────────────────────────
function renderReviewSection(game) {
  const container = document.getElementById("review-container");
  container.innerHTML = "";

  const hasReview = game.reviewText && game.reviewText.trim() !== "";
  const hasRating = game.rating && game.rating > 0;

  if (hasReview || hasRating) {
    // Show saved review
    const reviewDate = game.reviewedAt?.toDate
      ? game.reviewedAt.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "";

    container.innerHTML = `
      <div class="review-display" id="review-display">
        <div class="review-stars-row">${renderStarDisplay(game.rating)}</div>
        ${hasReview ? `<p class="review-text">${escapeHTML(game.reviewText)}</p>` : ""}
        ${reviewDate ? `<p class="review-date">Reviewed on ${reviewDate}</p>` : ""}
        <div class="review-edit-actions">
          <button class="review-btn" id="edit-review-btn">Edit Review</button>
          <button class="review-btn review-btn-delete" id="delete-review-btn">Delete Review</button>
        </div>
      </div>
    `;

    document.getElementById("edit-review-btn").addEventListener("click", () => showReviewForm(game));
    document.getElementById("delete-review-btn").addEventListener("click", handleDeleteReview);

  } else {
    // Show empty state + form
    showReviewForm(game);
  }
}

// ── Show the review write/edit form ──────────────────────────
function showReviewForm(game) {
  const container = document.getElementById("review-container");
  selectedRating = game.rating || 0;

  const formEl = document.createElement("div");
  formEl.classList.add("review-form");
  formEl.id = "review-form";

  // Star widget
  const widgetWrap = document.createElement("div");
  const widget = renderStarWidget(selectedRating, (val) => { selectedRating = val; });
  widgetWrap.appendChild(widget);
  formEl.appendChild(widgetWrap);

  // Textarea
  const textarea = document.createElement("textarea");
  textarea.classList.add("review-textarea");
  textarea.id = "review-textarea";
  textarea.placeholder = "Write your thoughts about this game...";
  textarea.value = game.reviewText || "";
  formEl.appendChild(textarea);

  // Buttons
  const actions = document.createElement("div");
  actions.classList.add("review-form-actions");
  actions.innerHTML = `
    <button class="detail-btn detail-btn-primary" id="save-review-btn">Save Review</button>
    ${(game.reviewText || game.rating) ? `<button class="review-btn" id="cancel-review-btn">Cancel</button>` : ""}
  `;
  formEl.appendChild(actions);

  container.innerHTML = "";
  container.appendChild(formEl);

  document.getElementById("save-review-btn").addEventListener("click", handleSaveReview);
  const cancelBtn = document.getElementById("cancel-review-btn");
  if (cancelBtn) cancelBtn.addEventListener("click", () => renderReviewSection(currentGame));
}

// ── Save review ───────────────────────────────────────────────
async function handleSaveReview() {
  const user = getCurrentUser();
  const reviewText = document.getElementById("review-textarea").value;

  if (selectedRating === 0 && reviewText.trim() === "") {
    showToast("Add a star rating or write something first!", "error");
    return;
  }

  const error = await saveReview(user.uid, gameId, {
    rating: selectedRating,
    reviewText: reviewText
  });

  if (error) {
    showToast("Error saving review: " + error, "error");
  } else {
    showToast("Review saved! ✨", "success");
    // Reload game data to reflect new rating on hero stars
    currentGame = await getGameById(user.uid, gameId);
    renderHero(currentGame);
    renderReviewSection(currentGame);
  }
}

// ── Delete review ─────────────────────────────────────────────
async function handleDeleteReview() {
  const user = getCurrentUser();
  const error = await deleteReview(user.uid, gameId);

  if (error) {
    showToast("Error deleting review: " + error, "error");
  } else {
    showToast("Review deleted.", "info");
    currentGame = await getGameById(user.uid, gameId);
    renderHero(currentGame);
    renderReviewSection(currentGame);
  }
}

// ── Favourite toggle ──────────────────────────────────────────
document.getElementById("detail-fav-btn").addEventListener("click", async () => {
  const user = getCurrentUser();
  const error = await toggleFavorite(user.uid, gameId, currentGame.favorite);
  if (!error) {
    currentGame.favorite = !currentGame.favorite;
    renderHero(currentGame);
  }
});

// ── Edit game button → go back to library and open modal ──────
// Simple approach: redirect to library with ?edit=GAMEID
document.getElementById("detail-edit-btn").addEventListener("click", () => {
  window.location.href = `library.html?edit=${gameId}`;
});

// ── Utility: escape HTML to prevent XSS in review text ───────
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Toast (reuse from ui.js) ──────────────────────────────────
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Render media gallery ──────────────────────────────────────
function renderMediaGallery(game) {
  const gallery = document.getElementById("media-gallery");
  const countEl = document.getElementById("media-count");
  if (!gallery) return;

  const files = getMediaForGame(game);
  gallery.innerHTML = "";

  // Update file count label
  if (countEl) {
    countEl.textContent = files.length === 0 ? "" : `${files.length} file${files.length !== 1 ? "s" : ""}`;
  }

  // Empty state
  if (files.length === 0) {
    gallery.innerHTML = `
      <div class="media-empty">
        <span class="media-empty-icon">📷</span>
        <p>No screenshots or clips yet. Upload some above!</p>
      </div>
    `;
    return;
  }

  files.forEach((item, index) => {
    const cell = document.createElement("div");
    cell.classList.add("media-cell");

    const isVideo = item.type === "video";

    const mediaEl = isVideo
      ? `<video src="${item.url}" class="media-thumb" preload="metadata"></video>`
      : `<img src="${item.url}" alt="screenshot ${index + 1}" class="media-thumb" loading="lazy" />`;

    cell.innerHTML = `
      ${mediaEl}
      ${isVideo ? `<span class="media-type-badge">▶ Video</span>` : ""}
      <div class="media-cell-overlay">
        <button class="media-view-btn" title="View fullscreen">⛶</button>
        <button class="media-delete-btn" title="Delete">🗑</button>
      </div>
    `;

    // Open lightbox on view click or cell click (not on delete)
    const viewBtn = cell.querySelector(".media-view-btn");
    viewBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLightbox(files, index);
    });

    cell.addEventListener("click", () => openLightbox(files, index));

    // Delete
    cell.querySelector(".media-delete-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      const user = getCurrentUser();
      const error = await deleteMedia(user.uid, gameId, item);
      if (error) {
        showToast("Error deleting file: " + error, "error");
      } else {
        showToast("File deleted.", "info");
        currentGame = await getGameById(user.uid, gameId);
        renderMediaGallery(currentGame);
      }
    });

    gallery.appendChild(cell);
  });
}

// ── Lightbox ──────────────────────────────────────────────────
let lightboxFiles = [];
let lightboxIndex = 0;

function openLightbox(files, index) {
  lightboxFiles = files;
  lightboxIndex = index;
  renderLightboxSlide();
  document.getElementById("media-lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  document.getElementById("media-lightbox").classList.remove("open");
  document.body.style.overflow = "";
  // Pause any playing video
  const video = document.querySelector("#lightbox-media video");
  if (video) video.pause();
}

function renderLightboxSlide() {
  const item = lightboxFiles[lightboxIndex];
  const mediaEl = document.getElementById("lightbox-media");
  const counter = document.getElementById("lightbox-counter");

  // Pause previous video if any
  const prevVideo = mediaEl.querySelector("video");
  if (prevVideo) prevVideo.pause();

  mediaEl.innerHTML = item.type === "video"
    ? `<video src="${item.url}" class="lightbox-video" controls autoplay></video>`
    : `<img src="${item.url}" alt="screenshot" class="lightbox-img" />`;

  counter.textContent = `${lightboxIndex + 1} / ${lightboxFiles.length}`;

  // Show/hide nav arrows
  document.getElementById("lightbox-prev").style.visibility = lightboxIndex > 0 ? "visible" : "hidden";
  document.getElementById("lightbox-next").style.visibility = lightboxIndex < lightboxFiles.length - 1 ? "visible" : "hidden";
}

// ── Handle file upload ────────────────────────────────────────
async function handleMediaUpload(files) {
  const user = getCurrentUser();
  const progressWrap = document.getElementById("media-progress-wrap");
  const progressBar = document.getElementById("media-progress-bar");
  const progressLabel = document.getElementById("media-progress-label");

  for (const file of files) {
    progressWrap.style.display = "flex";
    progressLabel.textContent = `Uploading ${file.name}...`;
    progressBar.style.width = "0%";

    const result = await uploadMedia(user.uid, gameId, file, (percent) => {
      progressBar.style.width = `${percent}%`;
      progressLabel.textContent = `Uploading ${file.name}... ${percent}%`;
    });

    if (result.error) {
      showToast(result.error, "error");
    } else {
      showToast("Upload complete! 📸", "success");
    }
  }

  progressWrap.style.display = "none";

  // Refresh game data and re-render gallery
  currentGame = await getGameById(user.uid, gameId);
  renderMediaGallery(currentGame);
}

// ── Wire up upload zone ───────────────────────────────────────
const fileInput = document.getElementById("media-file-input");
const uploadZone = document.getElementById("media-upload-zone");

// Click to browse
uploadZone.addEventListener("click", () => fileInput.click());

// File input change
fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) handleMediaUpload(Array.from(e.target.files));
  fileInput.value = ""; // reset so same file can be re-uploaded
});

// Drag and drop
uploadZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadZone.classList.add("drag-over");
});

uploadZone.addEventListener("dragleave", () => {
  uploadZone.classList.remove("drag-over");
});

uploadZone.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadZone.classList.remove("drag-over");
  const files = Array.from(e.dataTransfer.files);
  if (files.length > 0) handleMediaUpload(files);
});

// ── Wire up lightbox controls ─────────────────────────────────
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);

document.getElementById("lightbox-prev").addEventListener("click", () => {
  if (lightboxIndex > 0) {
    lightboxIndex--;
    renderLightboxSlide();
  }
});

document.getElementById("lightbox-next").addEventListener("click", () => {
  if (lightboxIndex < lightboxFiles.length - 1) {
    lightboxIndex++;
    renderLightboxSlide();
  }
});

// Close on backdrop click
document.getElementById("media-lightbox").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("media-lightbox");
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") { if (lightboxIndex > 0) { lightboxIndex--; renderLightboxSlide(); } }
  if (e.key === "ArrowRight") { if (lightboxIndex < lightboxFiles.length - 1) { lightboxIndex++; renderLightboxSlide(); } }
});

// ── Initial load ──────────────────────────────────────────────
supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    _setCurrentUser(session.user);
    loadGame();
  }
});