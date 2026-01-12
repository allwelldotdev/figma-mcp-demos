(() => {
  /**
   * Product carousel + "Quick add" toast feedback.
   *
   * This file assumes the following data attributes exist in `index.html`:
   * - [data-carousel]
   * - [data-carousel-track]
   * - [data-carousel-prev]
   * - [data-carousel-next]
   * - [data-quick-add] (buttons)
   * - [data-toast], [data-toast-text]
   */

  const root = document.querySelector("[data-carousel]");
  const track = document.querySelector("[data-carousel-track]");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");
  const toast = document.querySelector("[data-toast]");
  const toastText = document.querySelector("[data-toast-text]");

  if (!root || !track) return;

  const cards = () => Array.from(track.querySelectorAll("[data-product-card]"));

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function getCardStepPx() {
    const list = cards();
    if (list.length < 2) return list[0]?.getBoundingClientRect().width || 0;

    const r0 = list[0].getBoundingClientRect();
    const r1 = list[1].getBoundingClientRect();
    // Delta between card starts accounts for gap.
    const step = Math.round(r1.left - r0.left);
    return step > 0 ? step : Math.round(r0.width);
  }

  function scrollByCards(deltaCards) {
    const step = getCardStepPx();
    if (!step) return;

    const leftNow = track.scrollLeft;
    const target = leftNow + deltaCards * step;

    track.scrollTo({
      left: target,
      behavior: "smooth",
    });
  }

  function updateNavDisabled() {
    if (!prevBtn || !nextBtn) return;

    // If not scrollable, disable both.
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }

    const left = track.scrollLeft;
    const nearStart = left <= 1;
    const nearEnd = left >= maxScroll - 1;

    prevBtn.disabled = nearStart;
    nextBtn.disabled = nearEnd;
  }

  // --- Controls ---
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      scrollByCards(-1);
      // Update after scroll anim kicks in.
      window.setTimeout(updateNavDisabled, 250);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      scrollByCards(1);
      window.setTimeout(updateNavDisabled, 250);
    });
  }

  // Keyboard support when focus is within carousel.
  root.addEventListener("keydown", (e) => {
    // Don’t hijack keyboard when a button is focused.
    const target = /** @type {HTMLElement} */ (e.target);
    if (target && (target.tagName === "BUTTON" || target.tagName === "A")) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCards(-1);
      window.setTimeout(updateNavDisabled, 250);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCards(1);
      window.setTimeout(updateNavDisabled, 250);
    }
  });

  // Keep controls in sync with user scrolling/resizing.
  track.addEventListener(
    "scroll",
    () => {
      updateNavDisabled();
    },
    { passive: true }
  );
  window.addEventListener("resize", () => updateNavDisabled(), { passive: true });

  // --- Toast ---
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.hidden = false;

    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  // Quick add buttons: show feedback toast.
  root.addEventListener("click", (e) => {
    const btn = /** @type {HTMLElement|null} */ (e.target)?.closest?.("[data-quick-add]");
    if (!btn) return;

    const name = btn.getAttribute("data-product-name") || "Item";
    const price = btn.getAttribute("data-product-price") || "";

    const msg = price ? `Added “${name}” (${price})` : `Added “${name}”`;
    showToast(msg);
  });

  // Initialize.
  // If the track can scroll, we also ensure the first card is visible.
  updateNavDisabled();

  // Optional: ensure scroll starts at 0 (some browsers restore scroll on reload).
  try {
    track.scrollLeft = clamp(track.scrollLeft, 0, track.scrollWidth);
  } catch {
    // no-op
  }
})();
