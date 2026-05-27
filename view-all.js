// ===== VIEW ALL PAGE - JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initCanvas();
    initNavigation();
    initGitHubGrid();
    initSmoothScroll();
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

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

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
            this.opacity = Math.random() * 0.4 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.005;
            const colors = [
                { r: 240, g: 161, b: 199 },
                { r: 196, g: 113, b: 237 },
                { r: 139, g: 92, b: 246 },
                { r: 232, g: 122, b: 175 },
                { r: 245, g: 201, b: 126 },
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

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.1})`;
            ctx.fill();
        }
    }

    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

// ===== GITHUB PROJECTS GRID =====
const GITHUB_USERNAME = 'RyanFeige';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;

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

    const webKeywords = ['web', 'app', 'site', 'portfolio', 'website', 'html', 'css', 'react', 'vue', 'angular', 'next', 'frontend', 'landing'];
    const isWeb = repo.homepage || webKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k));
    if (isWeb) return { type: 'web', icon: 'github', class: 'dev-project' };

    const mobileKeywords = ['mobile', 'android', 'ios', 'flutter', 'react-native'];
    const isMobile = mobileKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k) || lang.includes(k));
    if (isMobile) return { type: 'mobile', icon: 'github', class: 'dev-project' };

    const dataKeywords = ['data', 'ml', 'ai', 'model', 'predict', 'analysis', 'dataset', 'tensorflow', 'pytorch'];
    const isData = dataKeywords.some(k => name.includes(k) || desc.includes(k) || topics.includes(k));
    if (isData) return { type: 'data', icon: 'github', class: 'dev-project' };

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

async function initGitHubGrid() {
    const grid = document.getElementById('projects-grid-full');
    if (!grid) return;

    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error('Failed to fetch repos');

        const repos = await response.json();
        const publicRepos = repos.filter(repo => !repo.fork);

        if (publicRepos.length === 0) {
            grid.innerHTML = `
                <div class="carousel-error">
                    <p>No public repositories found.</p>
                    <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">View GitHub Profile</a>
                </div>
            `;
            return;
        }

        grid.innerHTML = '';
        publicRepos.forEach(repo => {
            const card = createProjectCard(repo);
            grid.appendChild(card);
        });

        // Add reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        grid.querySelectorAll('.project-card').forEach((card, i) => {
            card.classList.add('reveal');
            card.style.transitionDelay = `${i * 0.05}s`;
            observer.observe(card);
        });

    } catch (error) {
        console.error('GitHub fetch error:', error);
        grid.innerHTML = `
            <div class="carousel-error">
                <p>Unable to load projects from GitHub.</p>
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank">View Profile on GitHub →</a>
            </div>
        `;
    }
}
