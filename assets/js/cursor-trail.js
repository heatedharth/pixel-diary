// ============================================================
// cursor-trail.js — Pixel sparkle trail
// ============================================================

let lastSparkleTime = 0;
const SPARKLE_INTERVAL = 28; // increase to 40+ if you want fewer sparkles

document.addEventListener("mousemove", (e) => {
  const now = Date.now();
  if (now - lastSparkleTime < SPARKLE_INTERVAL) return;
  lastSparkleTime = now;

  const s = document.createElement("span");
  s.className = "cursor-sparkle";

  const ox = (Math.random() - 0.5) * 10;
  const oy = (Math.random() - 0.5) * 10;

  s.style.left = `${e.clientX + ox}px`;
  s.style.top = `${e.clientY + oy}px`;

  const size = 6 + Math.random() * 5;
  s.style.width = `${size}px`;
  s.style.height = `${size}px`;

  document.body.appendChild(s);
  setTimeout(() => s.remove(), 560);
});