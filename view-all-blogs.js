// ===== ALL BLOG POSTS PAGE - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCanvas();
    initNavigation();
    initBlogGrid();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

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

// ===== PARTICLE CANVAS =====
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

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.005;
            const colors = [
                { r: 240, g: 161, b: 199 }, { r: 196, g: 113, b: 237 },
                { r: 139, g: 92, b: 246 }, { r: 232, g: 122, b: 175 }, { r: 245, g: 201, b: 126 },
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.opacitySpeed;
            if (this.opacity <= 0.05 || this.opacity >= 0.5) this.opacitySpeed *= -1;
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) { this.x += dx * 0.002; this.y += dy * 0.002; this.opacity = Math.min(this.opacity + 0.01, 0.6); }
            }
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`; ctx.fill();
            ctx.beginPath(); ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.1})`; ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const opacity = (1 - dist / 120) * 0.08;
                    ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(196, 113, 237, ${opacity})`; ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
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

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

// ===== BLOG POST GRID =====
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

function initBlogGrid() {
    const grid = document.getElementById('blog-grid-full');
    if (!grid) return;

    const posts = BLOG_POSTS;

    if (posts.length === 0) {
        grid.innerHTML = `<div class="carousel-error"><p>No blog posts yet. Check back soon!</p></div>`;
        return;
    }

    grid.innerHTML = '';
    posts.forEach(post => {
        const card = createBlogCard(post);
        grid.appendChild(card);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    grid.querySelectorAll('.project-card').forEach((card, i) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${i * 0.05}s`;
        observer.observe(card);
    });
}
