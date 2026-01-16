document.addEventListener('DOMContentLoaded', () => {
    // --- Service Section Tabs ---
    const serviceTabs = document.querySelectorAll('.service-list h3');
    const serviceTitle = document.querySelector('.service-description-card h2');
    const serviceDescription = document.querySelector('.service-description-card p');

    // Data for services based on the design context
    const servicesData = [
        {
            title: "In-room Amenities",
            description: "Provide your guests with luxurious, zero-waste amenities. From refillable shampoo dispensers to bamboo toothbrushes, our in-room solutions reduce plastic waste while elevating the guest experience with sustainable elegance."
        },
        {
            title: "Pool-side Essentials",
            description: "Protect Hawaii's delicate marine ecosystems with our reef-safe sunscreen and biodegradable pool accessories. Ensure your guests enjoy the sun responsibly with products that are kind to the ocean and their skin."
        },
        {
            title: "Integrate sustainability",
            description: "Our expert team will help you integrate sustainability into every aspect of your operations through; comprehensive sustainability audit, cost-saving recommendations, staff training on eco-friendly practices, ongoing support and optimization."
        }
    ];

    // Initialize content to match the first tab (which has active-service class in HTML)
    // Note: The static HTML had content for the 3rd tab but the 1st tab was active.
    // We update it here to stay consistent.
    if (serviceTitle && serviceDescription && servicesData[0]) {
        serviceTitle.textContent = servicesData[0].title;
        serviceDescription.textContent = servicesData[0].description;
    }

    serviceTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            serviceTabs.forEach(t => t.classList.remove('active-service'));

            // Add active class to clicked
            tab.classList.add('active-service');

            // Update Content
            const data = servicesData[index];
            if (data) {
                // Fade out effect
                const card = document.querySelector('.service-description-card');
                if(card) {
                    card.style.opacity = '0.5';
                    card.style.transition = 'opacity 0.2s ease';

                    setTimeout(() => {
                        serviceTitle.textContent = data.title;
                        serviceDescription.textContent = data.description;
                        card.style.opacity = '1';
                    }, 200);
                }
            }
        });
    });

    // --- Newsletter Subscription ---
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input.value;

            if (email) {
                // Simulate subscription
                const btn = newsletterForm.querySelector('button');
                const originalText = btn.innerHTML;

                btn.innerHTML = 'Subscribed!';
                btn.style.backgroundColor = '#4CAF50';
                input.value = '';

                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.backgroundColor = '';
                    alert(`Thanks for subscribing! We've sent a confirmation to ${email}.`);
                }, 2000);
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // --- Quick Add Buttons ---
    const quickAddButtons = document.querySelectorAll('.btn-quick-add');
    const cartBadge = document.querySelector('.cart-icon .badge-text');
    let cartCount = 0;

    quickAddButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cartCount++;
            if (cartBadge) {
                cartBadge.textContent = cartCount;

                // Animate badge
                const badge = cartBadge.parentElement;
                badge.style.transition = 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                badge.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 200);
            }

            // Button visual feedback
            const originalText = btn.textContent;
            btn.textContent = "Added";
            btn.style.backgroundColor = "#545454";

            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = "";
            }, 1000);
        });
    });

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
