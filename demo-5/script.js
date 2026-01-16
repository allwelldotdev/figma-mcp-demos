/* eslint-disable no-use-before-define */
(() => {
  "use strict";

  // Footer year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.getElementById("nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click (mobile)
    navMenu.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link) return;

      if (navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (t === navToggle || navToggle.contains(t)) return;
      if (t === navMenu || navMenu.contains(t)) return;

      if (navMenu.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Carousel
  const root = document.querySelector("[data-carousel]");
  const viewport = document.querySelector("[data-carousel-viewport]");
  const track = document.querySelector("[data-carousel-track]");
  const prevBtn = document.querySelector("[data-carousel-prev]");
  const nextBtn = document.querySelector("[data-carousel-next]");
  const dotBtns = Array.from(document.querySelectorAll("[data-carousel-dot]"));
  const slides = Array.from(document.querySelectorAll("[data-slide]"));

  if (!root || !viewport || !track || slides.length === 0) return;

  let index = 0;
  let slideWidth = 0; // computed in measure()
  let gap = 0; // computed in measure()
  let isDragging = false;
  let pointerId = null;
  let startX = 0;
  let currentX = 0;
  let dragStartTranslate = 0;
  let isAnimating = false;

  // Prefer reduced motion
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // Init
  measure();
  update(false);
  updateAriaLabels();

  // Buttons
  prevBtn?.addEventListener("click", () => goTo(index - 1, true));
  nextBtn?.addEventListener("click", () => goTo(index + 1, true));

  // Dots
  dotBtns.forEach((btn, i) => {
    btn.addEventListener("click", () => goTo(i, true));
  });

  // Keyboard: allow arrows when focus is within carousel
  root.tabIndex = 0;
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1, true);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1, true);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(slides.length - 1, true);
    }
  });

  // Pointer / drag (mouse + touch)
  viewport.style.touchAction = "pan-y";

  viewport.addEventListener("pointerdown", (e) => {
    // Only primary button for mouse
    if (e.pointerType === "mouse" && e.button !== 0) return;

    isDragging = true;
    pointerId = e.pointerId;
    viewport.setPointerCapture(pointerId);
    startX = e.clientX;
    currentX = startX;
    dragStartTranslate = getTranslateX();
    disableTransition();
  });

  viewport.addEventListener("pointermove", (e) => {
    if (!isDragging || pointerId !== e.pointerId) return;
    currentX = e.clientX;

    const dx = currentX - startX;
    const next = dragStartTranslate + dx;

    // Rubber-band at edges
    const min = -maxTranslate();
    const max = 0;
    let clamped = next;

    if (next > max) clamped = max + (next - max) * 0.25;
    if (next < min) clamped = min + (next - min) * 0.25;

    setTranslateX(clamped);
  });

  const endDrag = (e) => {
    if (!isDragging || (pointerId != null && e.pointerId !== pointerId)) return;
    isDragging = false;

    // Compute swipe intent
    const dx = currentX - startX;
    const abs = Math.abs(dx);

    // Use a threshold relative to slide width
    const threshold = Math.max(26, slideWidth * 0.12);

    // Snap based on direction/threshold
    enableTransition();
    if (abs > threshold) {
      if (dx < 0) goTo(index + 1, true);
      else goTo(index - 1, true);
    } else {
      // nearest slide
      goTo(index, false);
    }

    if (pointerId != null) {
      try {
        viewport.releasePointerCapture(pointerId);
      } catch {
        // ignore
      }
    }
    pointerId = null;
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("lostpointercapture", () => {
    if (!isDragging) return;
    isDragging = false;
    enableTransition();
    goTo(index, false);
    pointerId = null;
  });

  // Resize / re-measure
  let resizeRaf = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeRaf);
    resizeRaf = window.requestAnimationFrame(() => {
      const prevWidth = slideWidth;
      measure();
      if (slideWidth !== prevWidth) update(false);
    });
  });

  // Track transition end to avoid spamming
  track.addEventListener("transitionend", () => {
    isAnimating = false;
  });

  function goTo(nextIndex, userInitiated) {
    const clamped = clamp(nextIndex, 0, slides.length - 1);
    index = clamped;
    update(userInitiated);
    updateAriaLabels();
  }

  function update(userInitiated) {
    // If reduced motion, skip animation
    if (prefersReducedMotion) disableTransition();
    else enableTransition();

    const x = -(index * step());
    setTranslateX(x);

    // Update dots
    dotBtns.forEach((btn, i) => {
      btn.classList.toggle("is-active", i === index);
      // aria-selected can be useful even if role isn't set; harmless.
      btn.setAttribute("aria-selected", String(i === index));
    });

    // Update button disabled states
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;

    // If user initiated and motion is reduced, re-enable transition for future
    if (prefersReducedMotion && userInitiated) {
      // keep transition off for reduced motion
    } else if (!prefersReducedMotion && userInitiated) {
      // allow animation; nothing needed
    }

    isAnimating = !prefersReducedMotion;
  }

  function updateAriaLabels() {
    slides.forEach((s, i) => {
      // Keep a useful aria-label even if markup already has one.
      const n = i + 1;
      const total = slides.length;
      s.setAttribute("aria-label", `Slide ${n} of ${total}`);
      // Hide non-active slides for SRs (avoid reading all content)
      s.setAttribute("aria-hidden", String(i !== index));
      // Prevent tabbing into non-visible slides if any focusable elements are added later
      setInertFocusables(s, i !== index);
    });
  }

  function setInertFocusables(container, inert) {
    const focusables = container.querySelectorAll(
      'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
    );
    focusables.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      if (inert) {
        // store previous tabindex
        if (!el.hasAttribute("data-prev-tabindex")) {
          const prev = el.getAttribute("tabindex");
          el.setAttribute("data-prev-tabindex", prev == null ? "" : prev);
        }
        el.setAttribute("tabindex", "-1");
      } else {
        if (el.hasAttribute("data-prev-tabindex")) {
          const prev = el.getAttribute("data-prev-tabindex");
          el.removeAttribute("data-prev-tabindex");
          if (prev === "") el.removeAttribute("tabindex");
          else el.setAttribute("tabindex", prev);
        }
      }
    });
  }

  function measure() {
    // Slide width: use viewport content box
    const rect = viewport.getBoundingClientRect();
    slideWidth = rect.width;

    // Gap: read computed gap from track (supports px/normal)
    const styles = window.getComputedStyle(track);
    const gapStr = styles.columnGap || styles.gap || "0px";
    gap = parseFloat(gapStr) || 0;
  }

  function step() {
    // Each slide takes 100% width; gap is between items.
    return slideWidth + gap;
  }

  function maxTranslate() {
    // maximum negative translate magnitude (end position)
    return (slides.length - 1) * step();
  }

  function setTranslateX(x) {
    track.style.transform = `translate3d(${x}px, 0, 0)`;
  }

  function getTranslateX() {
    const t = track.style.transform;
    if (!t) return -(index * step());
    // Expect translate3d(Xpx, 0, 0)
    const match = t.match(/translate3d\(([-0-9.]+)px/i);
    if (!match) return -(index * step());
    const v = Number(match[1]);
    return Number.isFinite(v) ? v : -(index * step());
  }

  function disableTransition() {
    track.style.transition = "none";
  }

  function enableTransition() {
    track.style.transition = "";
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
})();
