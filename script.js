// ===== LOTUS PORTFOLIO - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCanvas();
    initNavigation();
    initScrollAnimations();
    initCounterAnimation();
    initSkillsCarousel();
    initContactForm();
    initSmoothScroll();
    initScrollNav();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Restore saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        html.setAttribute('data-theme', 'light');
    }

    toggle.addEventListener('click', () => {
        const isLight = html.getAttribute('data-theme') === 'light';
        if (isLight) {
            html.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            html.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== PARTICLE CANVAS BACKGROUND =====
function initCanvas() {
    const canvas = document.getElementById('lotus-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // Track mouse for interactive particles
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Rebuild particles with correct theme colors
    function buildParticles() {
        particles = [];
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Watch for theme toggle and rebuild particles
    const themeObserver = new MutationObserver(() => {
        particles.forEach(p => p.reset());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            this.opacity = isLight ? Math.random() * 0.35 + 0.2 : Math.random() * 0.4 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.005;
            // Lotus-inspired colors — more saturated/darker for light mode
            const colors = isLight ? [
                { r: 210, g: 80, b: 140 },  // deeper pink
                { r: 170, g: 60, b: 210 },  // deeper purple
                { r: 120, g: 60, b: 230 },  // deeper violet
                { r: 200, g: 70, b: 130 },  // deeper rose
                { r: 210, g: 150, b: 50 },  // richer gold
            ] : [
                { r: 240, g: 161, b: 199 }, // pink
                { r: 196, g: 113, b: 237 }, // purple
                { r: 139, g: 92, b: 246 },  // deeper purple
                { r: 232, g: 122, b: 175 }, // rose
                { r: 245, g: 201, b: 126 }, // gold
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.opacitySpeed;

            if (this.opacity <= 0.05 || this.opacity >= 0.5) {
                this.opacitySpeed *= -1;
            }

            // Mouse interaction — gentle attraction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x += dx * 0.002;
                    this.y += dy * 0.002;
                    this.opacity = Math.min(this.opacity + 0.01, 0.6);
                }
            }

            // Wrap around screen
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
            ctx.fill();

            // Subtle glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.1})`;
            ctx.fill();
        }
    }

    // Create particles based on screen size
    buildParticles();

    // Draw connections between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(196, 113, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

// ===== NAVIGATION =====
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const links = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // Update active nav link
        updateActiveLink();
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link tracking
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section, .hero');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Add reveal classes to elements
    const revealElements = [
        { selector: '.about-card', class: 'reveal' },
        { selector: '.expertise-card', class: 'reveal' },
        { selector: '.project-card', class: 'reveal' },
        { selector: '.info-card', class: 'reveal' },
        { selector: '.contact-form', class: 'reveal' },
        { selector: '.section-header', class: 'reveal' },
        { selector: '.tools-section', class: 'reveal' },
    ];

    revealElements.forEach(({ selector, class: cls }) => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add(cls);
            el.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    // Add stagger class to grids
    document.querySelectorAll('.about-grid, .expertise-grid').forEach(grid => {
        grid.classList.add('stagger-children');
    });

    // Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve so animations can replay if needed
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger-children').forEach(el => {
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * target);

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }
}

// ===== SKILLS CAROUSEL =====
function initSkillsCarousel() {
    const carousel = document.getElementById('skills-carousel');
    const prevBtn = document.getElementById('skills-prev');
    const nextBtn = document.getElementById('skills-next');

    if (!carousel || !prevBtn || !nextBtn) return;

    const cards = carousel.querySelectorAll('.skill-card');
    if (cards.length === 0) return;

    const VISIBLE = 3;
    let currentIndex = 0;

    function getCardStep() {
        if (cards.length < 2) return cards[0]?.offsetWidth || 260;
        return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function slideTo(index) {
        const maxIndex = Math.max(0, cards.length - VISIBLE);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        carousel.scrollTo({ left: currentIndex * getCardStep(), behavior: 'smooth' });
        updateButtons();
    }

    function updateButtons() {
        const maxIndex = Math.max(0, cards.length - VISIBLE);
        prevBtn.classList.toggle('hidden', currentIndex <= 0);
        nextBtn.classList.toggle('hidden', currentIndex >= maxIndex);
    }

    prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

    updateButtons();
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contact-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !subject || !message) {
            return;
        }

        // Snapshot the form BEFORE changing the button state
        const formContent = form.innerHTML;

        // Get the submit button and show loading state
        const submitBtn = document.getElementById('contact-submit');
        const origText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        try {
            const formData = new FormData(form);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                form.innerHTML = `
                    <div class="form-success">
                        <div class="success-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h3>Message Sent!</h3>
                        <p>Thank you, ${name}! I'll get back to you soon.</p>
                    </div>
                `;

                setTimeout(() => {
                    form.innerHTML = formContent;
                    initContactForm();
                }, 4000);
            } else {
                alert('Failed to send: ' + (result.message || 'Unknown error'));
                submitBtn.disabled = false;
                submitBtn.innerHTML = origText;
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
            alert('Could not send message — please try again or email me directly.');
        }
    });

    // Input focus effects
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ===== PARALLAX EFFECT ON LOTUS BLOOM =====
window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const lotus = document.querySelector('.lotus-bloom');
    if (lotus && scroll < window.innerHeight) {
        lotus.style.transform = `translateY(${scroll * 0.15}px) rotate(${scroll * 0.02}deg)`;
    }

    // Fade scroll indicator
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.opacity = Math.max(0, 1 - scroll / 300);
    }
});

// ===== TYPEWRITER EFFECT FOR HERO (subtle) =====
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
    const originalText = heroSubtitle.textContent;
    // Add a blinking cursor after subtitle loads
    setTimeout(() => {
        heroSubtitle.insertAdjacentHTML('afterend', '');
    }, 2000);
}

// ===== PRELOADER FADE =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ===== GITHUB PROJECTS CAROUSEL =====
document.addEventListener('DOMContentLoaded', () => {
    initGitHubCarousel();
});

const GITHUB_USERNAME = 'RyanFeige';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

// Icons SVG strings
const ICONS = {
    web: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    code: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    github: `<svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`,
    mobile: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
    data: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    ai: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.387-1 1.732V7h1a7 7 0 110 14H4a7 7 0 110-14h1V5.732A2.001 2.001 0 0112 2z"/><path d="M8 15h8M8 12h8"/></svg>`
};

function detectProjectType(repo) {
    const name = repo.name.toLowerCase();
    const lang = (repo.language || '').toLowerCase();
    const topics = (repo.topics || []).map(t => t.toLowerCase());
    const desc = (repo.description || '').toLowerCase();

    // Web project detection
    const webKeywords = ['web', 'app', 'site', 'portfolio', 'website', 'html', 'css', 'react', 'vue', 'angular', 'next', 'frontend', 'landing'];
    const isWeb = repo.homepage || webKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k));
    if (isWeb) return { type: 'web', icon: 'github', class: 'dev-project' };

    // Mobile detection
    const mobileKeywords = ['mobile', 'android', 'ios', 'flutter', 'react-native'];
    const isMobile = mobileKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k) || lang.includes(k));
    if (isMobile) return { type: 'mobile', icon: 'github', class: 'dev-project' };

    // Data/AI detection
    const dataKeywords = ['data', 'ml', 'ai', 'model', 'predict', 'analysis', 'dataset', 'tensorflow', 'pytorch'];
    const isData = dataKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k));
    if (isData) return { type: 'data', icon: 'github', class: 'dev-project' };

    // Default to github icon
    return { type: 'code', icon: 'github', class: 'dev-project' };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function createProjectCard(repo) {
    const projectType = detectProjectType(repo);
    const language = repo.language || 'Code';
    const updated = formatDate(repo.updated_at);
    const stars = repo.stargazers_count || 0;

    const card = document.createElement('div');
    card.className = 'project-card glass-card';
    card.innerHTML = `
        <div class="project-image">
            <div class="project-placeholder ${projectType.class}">
                ${ICONS[projectType.icon]}
            </div>
        </div>
        <div class="project-content">
            <div class="project-tags">
                <span class="project-tag">${language}</span>
                <span class="project-tag">⭐ ${stars}</span>
            </div>
            <h3>${repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}</h3>
            <p>${repo.description || 'A project by Ryan Feige'}</p>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View source code">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
                    </svg>
                    Code
                </a>
                ${repo.homepage ? `
                <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="project-link" aria-label="View live demo">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    Live
                </a>` : ''}
            </div>
        </div>
    `;
    return card;
}

async function initGitHubCarousel() {
    const carousel = document.getElementById('projects-carousel');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (!carousel) return;

    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error('Failed to fetch repos');

        const repos = await response.json();

        // Filter out forks and private repos (API already filters private)
        const publicRepos = repos.filter(repo => !repo.fork);

        if (publicRepos.length === 0) {
            carousel.innerHTML = `
                <div class="carousel-error">
                    <p>No public repositories found.</p>
                    <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">View GitHub Profile</a>
                </div>
            `;
            return;
        }

        // Clear loading state
        carousel.innerHTML = '';

        // Generate cards
        publicRepos.forEach(repo => {
            const card = createProjectCard(repo);
            carousel.appendChild(card);
        });

        // Setup carousel navigation — button-driven slider
        const cards = carousel.querySelectorAll('.project-card');
        let currentIndex = 0;
        const VISIBLE = 3;

        function getCardStep() {
            if (cards.length < 2) return cards[0]?.offsetWidth || 340;
            return cards[1].offsetLeft - cards[0].offsetLeft;
        }

        function slideTo(index) {
            const maxIndex = Math.max(0, cards.length - VISIBLE);
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            carousel.scrollTo({ left: currentIndex * getCardStep(), behavior: 'smooth' });
            updateButtons();
        }

        function updateButtons() {
            const maxIndex = Math.max(0, cards.length - VISIBLE);
            prevBtn.classList.toggle('hidden', currentIndex <= 0);
            nextBtn.classList.toggle('hidden', currentIndex >= maxIndex);
        }

        prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

        updateButtons();

        // Update on resize
        window.addEventListener('resize', () => {
            slideTo(currentIndex);
        });

        // Add reveal animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        carousel.querySelectorAll('.project-card').forEach((card, i) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${i * 0.1}s`;
            observer.observe(card);
        });

    } catch (error) {
        console.error('GitHub fetch error:', error);
        carousel.innerHTML = `
            <div class="carousel-error">
                <p>Unable to load projects from GitHub.</p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">View Profile on GitHub →</a>
            </div>
        `;
    }
}

// ===== BLOG CAROUSEL =====

const BLOG_POSTS = [
    {
        id: 1,
        title: "How I Built This Portfolio",
        slug: "building-this-portfolio",
        date: "2026-05-20",
        category: "Web Dev",
        excerpt: "A deep dive into the design and development of my lotus-themed portfolio — from particle animations to glassmorphism cards."
    },
    {
        id: 2,
        title: "My Trading Journey: Lessons from the Markets",
        slug: "trading-journey-lessons",
        date: "2026-05-15",
        category: "Trading",
        excerpt: "Reflections on my path from retail trading to building algorithmic strategies — what worked, what didn't, and what I learned."
    },
    {
        id: 3,
        title: "Why I Love Python for Automation",
        slug: "python-automation",
        date: "2026-05-10",
        category: "Coding",
        excerpt: "From web scraping to trading bots — Python has been my go-to for automation. Here's why it should be yours too."
    },
    {
        id: 4,
        title: "Getting Started with Algorithmic Trading",
        slug: "algorithmic-trading-basics",
        date: "2026-05-01",
        category: "Trading",
        excerpt: "A beginner-friendly guide to algorithmic trading concepts, backtesting frameworks, and risk management fundamentals."
    },
    {
        id: 5,
        title: "Designing with Dark Mode in Mind",
        slug: "dark-mode-design",
        date: "2026-04-20",
        category: "Design",
        excerpt: "Tips and tricks for creating beautiful dark mode interfaces that are easy on the eyes and look great."
    }
];

const BLOG_ICON = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
</svg>`;

function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'project-card glass-card';
    const date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    card.innerHTML = `
        <div class="project-image">
            <div class="project-placeholder dev-project">
                ${BLOG_ICON}
            </div>
        </div>
        <div class="project-content">
            <div class="project-tags">
                <span class="project-tag">${post.category}</span>
                <span class="project-tag">${date}</span>
            </div>
            <h3>${post.title}</h3>
            <p>${post.excerpt}</p>
            <div class="project-links">
                <a href="blog/${post.slug}.html" class="project-link" aria-label="Read post">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
                    </svg>
                    Read More
                </a>
            </div>
        </div>
    `;
    return card;
}

function initBlogCarousel() {
    const carousel = document.getElementById('blogs-carousel');
    const prevBtn = document.getElementById('blogs-prev');
    const nextBtn = document.getElementById('blogs-next');

    if (!carousel) return;

    const posts = BLOG_POSTS;

    if (posts.length === 0) {
        carousel.innerHTML = `
            <div class="carousel-error">
                <p>No blog posts yet. Check back soon!</p>
            </div>
        `;
        return;
    }

    carousel.innerHTML = '';
    posts.forEach(post => {
        const card = createBlogCard(post);
        carousel.appendChild(card);
    });

    // Setup carousel navigation
    const cards = carousel.querySelectorAll('.project-card');
    let currentIndex = 0;
    const VISIBLE = 3;

    function getCardStep() {
        if (cards.length < 2) return cards[0]?.offsetWidth || 340;
        return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function slideTo(index) {
        const maxIndex = Math.max(0, cards.length - VISIBLE);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        carousel.scrollTo({ left: currentIndex * getCardStep(), behavior: 'smooth' });
        updateButtons();
    }

    function updateButtons() {
        const maxIndex = Math.max(0, cards.length - VISIBLE);
        if (prevBtn) prevBtn.classList.toggle('hidden', currentIndex <= 0);
        if (nextBtn) nextBtn.classList.toggle('hidden', currentIndex >= maxIndex);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => slideTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => slideTo(currentIndex + 1));

    updateButtons();

    window.addEventListener('resize', () => {
        slideTo(currentIndex);
    });

}

// ===== SCROLL NAV BUTTONS =====
function initScrollNav() {
    const upBtn = document.getElementById('scroll-up-btn');
    const downBtn = document.getElementById('scroll-down-btn');
    if (!upBtn || !downBtn) return;

    const sections = Array.from(document.querySelectorAll('section[id]'));

    function findCurrentIndex() {
        const viewportMid = window.scrollY + window.innerHeight / 3;
        let idx = -1;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].offsetTop <= viewportMid + 50) idx = i;
            else break;
        }
        return idx;
    }

    function updateButtons() {
        const idx = findCurrentIndex();
        const docHeight = document.documentElement.scrollHeight;
        const remaining = docHeight - window.scrollY - window.innerHeight;
        const atTop = window.scrollY < 100;
        const atBottom = remaining < 30;

        upBtn.classList.toggle('visible', !atTop);
        downBtn.classList.toggle('visible', !atBottom);
    }

    downBtn.addEventListener('click', () => {
        const idx = findCurrentIndex();
        const next = Math.min(idx + 1, sections.length - 1);
        sections[next].scrollIntoView({ behavior: 'smooth' });
    });

    upBtn.addEventListener('click', () => {
        const idx = findCurrentIndex();
        const prev = Math.max(idx - 1, 0);
        sections[prev].scrollIntoView({ behavior: 'smooth' });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { updateButtons(); ticking = false; });
            ticking = true;
        }
    });

    updateButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    initBlogCarousel();
});