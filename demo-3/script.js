// Product Carousel Functionality
class ProductCarousel {
    constructor() {
        this.track = document.querySelector('.product-track');
        this.prevButton = document.querySelector('.carousel-nav.prev');
        this.nextButton = document.querySelector('.carousel-nav.next');
        this.cards = document.querySelectorAll('.product-card');
        this.currentIndex = 0;
        this.cardWidth = 338;
        this.gap = 29;
        this.totalCards = 4; // Original products count
        this.visibleCards = this.getVisibleCards();

        this.init();
    }

    init() {
        this.updateCardWidth();
        this.attachEventListeners();
        this.updateButtonStates();

        // Update on window resize
        window.addEventListener('resize', () => {
            this.updateCardWidth();
            this.visibleCards = this.getVisibleCards();
            this.goToSlide(this.currentIndex);
        });

        // Add touch/swipe support
        this.addTouchSupport();
    }

    getVisibleCards() {
        const containerWidth = document.querySelector('.product-carousel').offsetWidth;
        const cardTotalWidth = this.cardWidth + this.gap;
        return Math.floor(containerWidth / cardTotalWidth);
    }

    updateCardWidth() {
        if (this.cards.length > 0) {
            const computedStyle = window.getComputedStyle(this.cards[0]);
            this.cardWidth = this.cards[0].offsetWidth;

            // Get gap from computed style
            const trackStyle = window.getComputedStyle(this.track);
            const gapValue = trackStyle.gap || '29px';
            this.gap = parseInt(gapValue);
        }
    }

    attachEventListeners() {
        this.prevButton.addEventListener('click', () => this.prev());
        this.nextButton.addEventListener('click', () => this.next());
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.goToSlide(this.currentIndex);
        }
    }

    next() {
        const maxIndex = this.totalCards - this.visibleCards;
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.goToSlide(this.currentIndex);
        }
    }

    goToSlide(index) {
        const offset = index * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(-${offset}px)`;
        this.updateButtonStates();
    }

    updateButtonStates() {
        // Disable prev button if at start
        if (this.currentIndex === 0) {
            this.prevButton.disabled = true;
            this.prevButton.style.opacity = '0.3';
        } else {
            this.prevButton.disabled = false;
            this.prevButton.style.opacity = '1';
        }

        // Disable next button if at end
        const maxIndex = this.totalCards - this.visibleCards;
        if (this.currentIndex >= maxIndex) {
            this.nextButton.disabled = true;
            this.nextButton.style.opacity = '0.3';
        } else {
            this.nextButton.disabled = false;
            this.nextButton.style.opacity = '1';
        }
    }

    addTouchSupport() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });

        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;

            const diff = startX - currentX;
            const threshold = 50; // Minimum swipe distance

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
        });

        // Mouse drag support
        let mouseStartX = 0;
        let mouseCurrentX = 0;
        let isMouseDragging = false;

        this.track.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.track.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            mouseCurrentX = e.clientX;
        });

        document.addEventListener('mouseup', () => {
            if (!isMouseDragging) return;

            const diff = mouseStartX - mouseCurrentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isMouseDragging = false;
            this.track.style.cursor = 'grab';
        });

        this.track.style.cursor = 'grab';
    }
}

// Quick Add Button Functionality
function initQuickAddButtons() {
    const quickAddButtons = document.querySelectorAll('.btn-quick-add');

    quickAddButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h4').textContent;
            const productPrice = productCard.querySelector('.price').textContent;

            // Add animation feedback
            button.textContent = 'Added!';
            button.style.background = '#4CAF50';

            // Update cart badge (demo purposes)
            updateCartBadge();

            // Reset button after delay
            setTimeout(() => {
                button.textContent = 'Quick add';
                button.style.background = '#000000';
            }, 1500);

            console.log(`Added to cart: ${productName} - ${productPrice}`);
        });
    });
}

// Cart Badge Update
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-btn .badge');
    const currentCount = parseInt(cartBadge.textContent);
    cartBadge.textContent = currentCount + 1;
}

// Auto-scroll functionality (optional)
function initAutoScroll(carousel, interval = 5000) {
    let autoScrollTimer;

    function startAutoScroll() {
        autoScrollTimer = setInterval(() => {
            carousel.next();

            // Reset to beginning if at end
            const maxIndex = carousel.totalCards - carousel.visibleCards;
            if (carousel.currentIndex >= maxIndex) {
                setTimeout(() => {
                    carousel.currentIndex = 0;
                    carousel.goToSlide(0);
                }, 1000);
            }
        }, interval);
    }

    function stopAutoScroll() {
        clearInterval(autoScrollTimer);
    }

    // Start auto-scroll
    startAutoScroll();

    // Pause on hover
    const carouselWrapper = document.querySelector('.product-carousel-wrapper');
    carouselWrapper.addEventListener('mouseenter', stopAutoScroll);
    carouselWrapper.addEventListener('mouseleave', startAutoScroll);

    // Pause on button click
    carousel.prevButton.addEventListener('click', () => {
        stopAutoScroll();
        startAutoScroll();
    });

    carousel.nextButton.addEventListener('click', () => {
        stopAutoScroll();
        startAutoScroll();
    });
}

// Smooth Scroll for Navigation Links
function initSmoothScroll() {
    const menuLinks = document.querySelectorAll('.menu-icons a');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Only apply smooth scroll for anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Add scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Add initial styles and observe elements
    const animatedElements = document.querySelectorAll('.product-card, .tag-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel
    const carousel = new ProductCarousel();

    // Initialize quick add buttons
    initQuickAddButtons();

    // Initialize smooth scroll
    initSmoothScroll();

    // Initialize lazy loading
    initLazyLoading();

    // Initialize scroll animations
    initScrollAnimations();

    // Optional: Enable auto-scroll (uncomment to activate)
    // initAutoScroll(carousel, 5000);

    console.log('LSS Website initialized successfully!');
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) return;

    if (e.key === 'ArrowLeft') {
        document.querySelector('.carousel-nav.prev').click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.carousel-nav.next').click();
    }
});
