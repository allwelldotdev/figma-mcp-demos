document.addEventListener("DOMContentLoaded", () => {
  // --- Service Section Tabs ---
  const serviceItems = document.querySelectorAll(".service-item");
  const serviceTitle = document.querySelector(".service-content h2");
  const serviceDesc = document.querySelector(".service-content p");
  const serviceImage = document.querySelector(".service-image img");

  // Dummy data for services since full content wasn't fully extracted/visible for all states
  const serviceData = {
    "In-room Amenities": {
      title: "Eco-friendly Amenities",
      desc: "Delight your guests with our range of zero-waste, refillable in-room amenities. From shampoo bars to bamboo toothbrushes, we provide luxurious, sustainable alternatives that reduce plastic waste without compromising on quality.",
      image: "images/service-bg.png", // Using same image for demo, or placeholder
    },
    "Pool-side Essentials": {
      title: "Reef-safe Protection",
      desc: "Protect your guests and the ocean with our reef-safe sunscreens and pool-side essentials. Our products are free from harmful chemicals, ensuring a safe and enjoyable experience for everyone while preserving marine ecosystems.",
      image: "images/service-bg.png",
    },
    "Sustainable Consulting": {
      title: "Integrate sustainability",
      desc: "Our expert team will help you integrate sustainability into every aspect of your operations through; comprehensive sustainability audit, cost-saving recommendations, staff training on eco-friendly practices, ongoing support and optimization.",
      image: "images/service-bg.png",
    },
  };

  serviceItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class from all
      serviceItems.forEach((i) => i.classList.remove("active"));
      // Add active class to clicked
      item.classList.add("active");

      // Update content
      const key = item.textContent.trim();
      const data = serviceData[key];
      if (data) {
        serviceTitle.textContent = data.title;
        serviceDesc.textContent = data.desc;
        // serviceImage.src = data.image; // unique images if available

        // Simple fade animation
        const contentContainer = document.querySelector(".service-content");
        contentContainer.style.opacity = 0;
        setTimeout(() => {
          contentContainer.style.opacity = 1;
        }, 200);
      }
    });
  });

  // --- Cart Functionality ---
  const quickAddBtns = document.querySelectorAll(".btn-quick-add");
  const shopNowBtns = document.querySelectorAll(".btn-shop");
  const cartBadge = document.querySelector(".icon-group.cart .badge");
  let cartCount = 0;

  function updateCart() {
    cartCount++;
    if (cartBadge) {
      cartBadge.textContent = cartCount;

      // Tiny bounce animation for badge
      cartBadge.style.transform = "scale(1.2)";
      setTimeout(() => {
        cartBadge.style.transform = "scale(1)";
      }, 200);
    }
  }

  quickAddBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      updateCart();

      // Feedback on button
      const originalText = btn.textContent;
      btn.textContent = "Added!";
      btn.style.backgroundColor = "#024D46"; // Accent green
      btn.style.color = "white";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        btn.style.color = "";
      }, 1000);
    });
  });

  shopNowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("Navigating to shop...");
      // For demo, just scroll to products
      const productSection = document.querySelector(".product-section");
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // --- Reviews Navigation ---
  const reviewsContainer = document.querySelector(".reviews-container");
  const reviewNavBtn = document.querySelector(".reviews-nav img"); // Assuming this is next button

  if (reviewsContainer && reviewNavBtn) {
    reviewNavBtn.addEventListener("click", () => {
      // Scroll right
      const scrollAmount = 400; // Approx card width
      const maxScroll =
        reviewsContainer.scrollWidth - reviewsContainer.clientWidth;

      if (reviewsContainer.scrollLeft + 10 >= maxScroll) {
        reviewsContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        reviewsContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    });

    // Also enable drag scrolling for reviews
    let isDown = false;
    let startX;
    let scrollLeft;

    reviewsContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      reviewsContainer.classList.add("active");
      startX = e.pageX - reviewsContainer.offsetLeft;
      scrollLeft = reviewsContainer.scrollLeft;
      reviewsContainer.style.cursor = "grabbing";
    });
    reviewsContainer.addEventListener("mouseleave", () => {
      isDown = false;
      reviewsContainer.classList.remove("active");
      reviewsContainer.style.cursor = "grab";
    });
    reviewsContainer.addEventListener("mouseup", () => {
      isDown = false;
      reviewsContainer.classList.remove("active");
      reviewsContainer.style.cursor = "grab";
    });
    reviewsContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - reviewsContainer.offsetLeft;
      const walk = (x - startX) * 2; //scroll-fast
      reviewsContainer.scrollLeft = scrollLeft - walk;
    });
  }

  // --- Newsletter Form ---
  const newsletterForm = document.querySelector(".email-leads");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector("input");
      const btn = newsletterForm.querySelector("button");

      if (input.value) {
        // Simulate API call
        const originalBtnContent = btn.innerHTML;
        btn.textContent = "Subscribed!";
        btn.disabled = true;
        input.value = "";

        setTimeout(() => {
          btn.innerHTML = originalBtnContent;
          btn.disabled = false;
        }, 3000);
      }
    });
  }

  // --- Contact Button ---
  const contactBtn = document.querySelector(".btn-contact");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      // Scroll to footer contact info
      const footerMain = document.querySelector(".footer-main");
      if (footerMain) {
        footerMain.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
