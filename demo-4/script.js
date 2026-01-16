document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("track");
  const nextButton = document.getElementById("nextBtn");
  const prevButton = document.getElementById("prevBtn");
  const indicatorsContainer = document.getElementById("indicators");

  if (!track) return;

  const items = Array.from(track.children);
  if (items.length === 0) return;

  let currentIndex = 0;

  // Calculate movement distance (width + gap)
  const getSlideWidth = () => {
    const item = items[0];
    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 24; // Default to 24 if not set
    return item.getBoundingClientRect().width + gap;
  };

  // Initialize Indicators
  if (indicatorsContainer) {
    items.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("indicator-dot");
      if (index === 0) dot.classList.add("active");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

      dot.addEventListener("click", () => {
        goToSlide(index);
      });

      indicatorsContainer.appendChild(dot);
    });
  }

  const updateIndicators = (index) => {
    if (!indicatorsContainer) return;
    const dots = Array.from(indicatorsContainer.children);
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  };

  const goToSlide = (index) => {
    // Handle looping
    if (index < 0) {
      index = items.length - 1;
    } else if (index >= items.length) {
      index = 0;
    }

    const slideWidth = getSlideWidth();
    const targetTranslate = slideWidth * index;

    track.style.transform = `translateX(-${targetTranslate}px)`;
    currentIndex = index;
    updateIndicators(currentIndex);
  };

  // Event Listeners
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });
  }

  // Handle Resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate position on resize to maintain correct alignment
      goToSlide(currentIndex);
    }, 100);
  });
});
