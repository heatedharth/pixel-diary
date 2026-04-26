// ============================================================
// cursor-trail.js — Desktop-only sparkle trail
// Runs only on devices with a fine pointer + hover (desktop/laptop)
// ============================================================

const isDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (isDesktopPointer && !prefersReduced) {
  let lastSparkleTime = 0;
  const SPARKLE_INTERVAL = 28; // lower = more sparkles

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastSparkleTime < SPARKLE_INTERVAL) return;
    lastSparkleTime = now;

    const s = document.createElement("span");
    s.className = "cursor-sparkle";

    const ox = (Math.random() - 0.5) * 10;
    const oy = (Math.random() - 0.5) * 10;

    // Use page coords so scrolling doesn't cause weird jumps
    s.style.left = `${window.scrollX + e.clientX + ox}px`;
    s.style.top = `${window.scrollY + e.clientY + oy}px`;

    const size = 6 + Math.random() * 5;
    s.style.width = `${size}px`;
    s.style.height = `${size}px`;

    document.body.appendChild(s);
    setTimeout(() => s.remove(), 560);
  }, { passive: true });
}