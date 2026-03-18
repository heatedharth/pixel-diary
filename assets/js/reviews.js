// ============================================================
// reviews.js — Ratings and Reviews (Supabase)
// Reviews are stored directly on the game row as columns:
//   rating      (int 1–5, or 0 if not rated)
//   reviewText  (text)
//   reviewedAt  (timestamp)
// Depends on: supabase.config.js (supabaseClient)
// ============================================================

// ── Save / Update Review ──────────────────────────────────────
async function saveReview(uid, gameId, { rating, reviewText }) {
  const { error } = await supabaseClient
    .from("games")
    .update({
      rating: rating,
      reviewText: reviewText.trim(),
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .eq("id", gameId)
    .eq("userId", uid);

  return error ? error.message : null;
}

// ── Delete Review ─────────────────────────────────────────────
async function deleteReview(uid, gameId) {
  const { error } = await supabaseClient
    .from("games")
    .update({
      rating: 0,
      reviewText: "",
      reviewedAt: null,
      updatedAt: new Date().toISOString()
    })
    .eq("id", gameId)
    .eq("userId", uid);

  return error ? error.message : null;
}

// ── Render Star Display (read-only) ───────────────────────────
// Returns an HTML string of filled/empty stars.
// Used on game cards and the detail page header.
function renderStarDisplay(rating) {
  if (!rating || rating === 0) return `<span class="stars-empty">No rating yet</span>`;
  let html = `<span class="stars" aria-label="${rating} out of 5 stars">`;
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= rating ? "filled" : "empty"}">★</span>`;
  }
  html += `</span>`;
  return html;
}

// ── Render Interactive Star Widget ────────────────────────────
// Returns a DOM element with clickable stars.
// onSelect(rating) fires with the chosen value (1–5).
function renderStarWidget(currentRating, onSelect) {
  const wrap = document.createElement("div");
  wrap.classList.add("star-widget");

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("button");
    star.type = "button";
    star.classList.add("star-btn");
    star.dataset.val = i;
    star.textContent = "★";
    star.setAttribute("aria-label", `Rate ${i} star${i > 1 ? "s" : ""}`);
    if (i <= currentRating) star.classList.add("selected");

    star.addEventListener("mouseenter", () => {
      wrap.querySelectorAll(".star-btn").forEach(s => {
        s.classList.toggle("hover", Number(s.dataset.val) <= i);
      });
    });

    star.addEventListener("click", () => {
      const val = Number(star.dataset.val);
      wrap.querySelectorAll(".star-btn").forEach(s => {
        s.classList.toggle("selected", Number(s.dataset.val) <= val);
      });
      onSelect(val);
    });

    wrap.appendChild(star);
  }

  wrap.addEventListener("mouseleave", () => {
    wrap.querySelectorAll(".star-btn").forEach(s => s.classList.remove("hover"));
  });

  return wrap;
}