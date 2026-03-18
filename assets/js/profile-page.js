// ============================================================
// profile-page.js — Profile Page Logic
// Loads profile, renders all sections, handles edits/uploads.
// Depends on: supabase.config.js, db.js, auth.js, app.js,
//             profile.js, games.js
// ============================================================

// ── Protect page ─────────────────────────────────────────────
requireAuth("login.html");

// ── State ─────────────────────────────────────────────────────
let currentProfile = null;

// ── Initial load ──────────────────────────────────────────────
supabaseClient.auth.onAuthStateChange(async (event, session) => {
  if (!session?.user) return;
  _setCurrentUser(session.user);
  await loadProfile();
});

// ── Load everything ───────────────────────────────────────────
async function loadProfile() {
  const user = getCurrentUser();
  if (!user) return;

  currentProfile = await getProfile(user.uid);
  if (!currentProfile) return;

  renderBanner(currentProfile);
  renderAvatar(currentProfile);
  renderUserInfo(currentProfile);

  const stats = await getProfileStats(user.uid);
  renderStats(stats);

  const favGames = await getFavoriteGames(user.uid);
  renderFavorites(favGames);
}

// ── Render Banner ─────────────────────────────────────────────
function renderBanner(profile) {
  const bannerEl = document.getElementById("profile-banner");
  if (profile.bannerURL) {
    bannerEl.style.backgroundImage = `url(${profile.bannerURL})`;
    bannerEl.classList.add("has-image");
  } else {
    bannerEl.style.backgroundImage = "";
    bannerEl.classList.remove("has-image");
  }
}

// ── Render Avatar ─────────────────────────────────────────────
function renderAvatar(profile) {
  const avatarEl = document.getElementById("profile-avatar");
  if (profile.avatarURL) {
    avatarEl.innerHTML = `<img src="${profile.avatarURL}" alt="avatar" class="avatar-img" />`;
  } else {
    const initials = (profile.username || "?").charAt(0).toUpperCase();
    avatarEl.innerHTML = `<span class="avatar-initials">${initials}</span>`;
  }
}

// ── Render Username + Bio ─────────────────────────────────────
function renderUserInfo(profile) {
  document.getElementById("profile-username").textContent = profile.username || "No username";
  document.getElementById("profile-bio").textContent      = profile.bio || "No bio yet — add one!";
  document.getElementById("profile-email").textContent    = profile.email || "";
}

// ── Render Stats ──────────────────────────────────────────────
function renderStats(stats) {
  document.getElementById("pstat-total").textContent     = stats.total;
  document.getElementById("pstat-played").textContent    = stats.played;
  document.getElementById("pstat-playing").textContent   = stats.playing;
  document.getElementById("pstat-plan").textContent      = stats.plan;
  document.getElementById("pstat-favorites").textContent = stats.favorites;
}

// ── Render Favorites Grid ─────────────────────────────────────
function renderFavorites(games) {
  const grid  = document.getElementById("favorites-grid");
  const empty = document.getElementById("favorites-empty");

  grid.innerHTML = "";

  if (games.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  games.forEach(game => {
    const card = document.createElement("a");
    card.classList.add("fav-card");
    card.href = `game-detail.html?id=${game.id}`;

    const statusClass = {
      "played": "badge-played", "playing": "badge-playing", "plan-to-play": "badge-plan"
    }[game.status] || "badge-plan";

    card.innerHTML = `
      ${game.coverURL
        ? `<img src="${game.coverURL}" class="fav-cover" alt="${game.title}" />`
        : `<div class="fav-cover-placeholder">🎮</div>`}
      <div class="fav-info">
        <p class="fav-title">${game.title}</p>
        <span class="card-badge ${statusClass} fav-badge">${
          { "played": "Played", "playing": "Playing", "plan-to-play": "Plan to Play" }[game.status] || ""
        }</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── Edit Profile Toggle ───────────────────────────────────────
const editBtn   = document.getElementById("edit-profile-btn");
const editForm  = document.getElementById("edit-profile-form");
const cancelBtn = document.getElementById("edit-cancel-btn");

editBtn.addEventListener("click", () => {
  // Pre-fill form with current values
  document.getElementById("edit-username").value = currentProfile?.username || "";
  document.getElementById("edit-bio").value      = currentProfile?.bio      || "";
  editForm.style.display = "block";
  editBtn.style.display  = "none";
});

cancelBtn.addEventListener("click", () => {
  editForm.style.display = "none";
  editBtn.style.display  = "inline-flex";
});

// ── Save Profile Text Fields ──────────────────────────────────
document.getElementById("edit-profile-save").addEventListener("click", async () => {
  const user     = getCurrentUser();
  const username = document.getElementById("edit-username").value.trim();
  const bio      = document.getElementById("edit-bio").value.trim();

  if (!username) {
    showProfileToast("Username can't be empty.", "error");
    return;
  }

  const error = await updateProfile(user.uid, { username, bio });
  if (error) {
    showProfileToast("Error saving profile: " + error, "error");
  } else {
    showProfileToast("Profile updated! ✨", "success");
    editForm.style.display = "none";
    editBtn.style.display  = "inline-flex";
    await loadProfile();
  }
});

// ── Avatar Upload ─────────────────────────────────────────────
document.getElementById("avatar-upload-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user   = getCurrentUser();
  showProfileToast("Uploading avatar...", "info");

  const result = await uploadAvatar(user.uid, file);
  if (result.error) {
    showProfileToast("Error uploading avatar: " + result.error, "error");
  } else {
    showProfileToast("Avatar updated! 🌸", "success");
    await loadProfile();
  }
  e.target.value = "";
});

// ── Banner Upload ─────────────────────────────────────────────
document.getElementById("banner-upload-input").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const user   = getCurrentUser();
  showProfileToast("Uploading banner...", "info");

  const result = await uploadBanner(user.uid, file);
  if (result.error) {
    showProfileToast("Error uploading banner: " + result.error, "error");
  } else {
    showProfileToast("Banner updated! 🎨", "success");
    await loadProfile();
  }
  e.target.value = "";
});

// ── Toast ──────────────────────────────────────────────────────
function showProfileToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className   = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3000);
}
