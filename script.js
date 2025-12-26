document.addEventListener('DOMContentLoaded', () => {

    // --- Component Loading ---
    async function loadComponent(id, file) {
        const element = document.getElementById(id);
        if (element) {
            try {
                const response = await fetch(file);
                if (response.ok) {
                    const html = await response.text();
                    element.innerHTML = html;

                    // After loading header, initialize mobile menu and correct active link
                    if (id === 'header') {
                        initMobileMenu();
                        setActiveLink();
                        // Re-initialize scroll effect because the header element was just inserted
                        initScrollEffect();
                    }
                } else {
                    console.error(`Failed to load ${file}: ${response.status}`);
                }
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        }
    }

    // Load Header and Footer
    // loadComponent('header', 'header.html');
    // loadComponent('footer', 'footer.html');

    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            // Check if link href matches current path
            // Handle specific cases like about.html#process being identified as about.html
            const linkPath = link.getAttribute('href').split('#')[0];

            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    function initMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navList = document.querySelector('.nav-list');

        if (hamburger && navList) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navList.classList.toggle('active');

                if (navList.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            const closeBtn = document.querySelector('.close-menu');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // Close menu when clicking a link
            const navLinks = navList.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navList.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }
    }

    function initScrollEffect() {
        // --- Header Scroll Effect ---
        const header = document.getElementById('header');

        function toggleHeaderScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (header) {
            // Initial check
            toggleHeaderScroll();
            window.addEventListener('scroll', toggleHeaderScroll);
        }
    }


    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to run only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .reveal-left, .reveal-right, .reveal-up');
    animatedElements.forEach(el => observer.observe(el));





    // --- Smooth Scrolling for Anchor Links ---
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


    // --- Simple Form Handling ---
    const form = document.getElementById('inquiryForm');
    const status = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                btn.innerText = 'Sent Successfully!';
                btn.style.backgroundColor = 'var(--color-accent)';
                status.innerText = "Thank you! We'll be in touch shortly.";
                status.style.color = 'var(--color-primary)';
                form.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    status.innerText = '';
                }, 3000);
            }, 1000);
        });
    }

    // --- Mobile Menu Toggle ---
    initMobileMenu();
    initScrollEffect();

    // --- Homepage Slider Logic ---
    const track = document.querySelector('.slider-track');
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (track && slides.length > 0 && nextBtn && prevBtn) {
        let currentIndex = 0;
        const totalSlides = slides.length;

        function updateSlider() {
            // translate the track to show the current slide
            // assuming each slide is 100% width
            const amountToMove = -currentIndex * 100;
            track.style.transform = `translateX(${amountToMove}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider();
        });

        // Optional: Auto-play
        let autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider();
        }, 5000);

        // Pause on hover
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => clearInterval(autoPlay));
            sliderContainer.addEventListener('mouseleave', () => {
                autoPlay = setInterval(() => {
                    currentIndex = (currentIndex + 1) % totalSlides;
                    updateSlider();
                }, 5000);
            });
        }
    }
});
