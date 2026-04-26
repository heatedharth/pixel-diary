// ============================================================
// cursor-trail.js — Pixel sparkle trail
// ============================================================

// cursor-trail.js — mobile-safe sparkle trail
let lastSparkleTime = 0;
const SPARKLE_INTERVAL = 45; // fewer particles = less jitter

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(pointer: coarse)").matches;

if (!prefersReduced && !isTouch) {
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < SPARKLE_INTERVAL) return;
    lastSparkleTime = now;

    const s = document.createElement("span");
    s.className = "cursor-sparkle";

    const ox = (Math.random() - 0.5) * 8;
    const oy = (Math.random() - 0.5) * 8;

    // absolute to document, not fixed to viewport
    s.style.left = `${window.scrollX + e.clientX + ox}px`;
    s.style.top = `${window.scrollY + e.clientY + oy}px`;

    const size = 5 + Math.random() * 4;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;

    document.body.appendChild(s);
    setTimeout(() => s.remove(), 450);
  }, { passive: true });
}