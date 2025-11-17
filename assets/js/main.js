// ===================================
// Configuration & State
// ===================================
const CONFIG = {
    dataPath: 'data/',
    jsonFiles: {
        siteConfig: 'site-config.json',
        socialLinks: 'social-links.json',
        experience: 'experience.json',
        education: 'education.json',
        portfolioItems: 'portfolio-items.json',
        gamesShowcase: 'games-showcase.json',
        footer: 'footer.json'
    }
};

let appData = {};

// ===================================
// Initialization
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load all JSON data
        await loadAllData();
        
        // Initialize all components
        initNavigation();
        initHeroSection();
        initAboutSection();
        initExperienceSection();
        initEducationSection();
        initProjectsSection();
        initGamesSection();
        initContactSection();
        initFooter();
        initScrollEffects();
        initBackToTop();
        
        // Hide loading screen
        hideLoadingScreen();
    } catch (error) {
        console.error('Error initializing application:', error);
        hideLoadingScreen();
    }
});

// ===================================
// Data Loading
// ===================================
async function loadAllData() {
    const loadPromises = Object.entries(CONFIG.jsonFiles).map(async ([key, filename]) => {
        try {
            const response = await fetch(`${CONFIG.dataPath}${filename}`);
            if (!response.ok) throw new Error(`Failed to load ${filename}`);
            appData[key] = await response.json();
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
            appData[key] = null;
        }
    });
    
    await Promise.all(loadPromises);
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 500);
    }
}

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });
    
    // Smooth scrolling
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

// ===================================
// Hero Section
// ===================================
function initHeroSection() {
    const config = appData.siteConfig;
    const socialLinks = appData.socialLinks;
    
    if (config) {
        // Set avatar
        const avatar = document.getElementById('hero-avatar');
        if (avatar && config.personal.avatar) {
            avatar.src = config.personal.avatar;
            avatar.alt = config.personal.name;
        }
        
        // Set name
        const heroName = document.getElementById('hero-name');
        if (heroName) {
            heroName.textContent = config.personal.name;
        }
        
        // Typing effect for titles
        const typingText = document.getElementById('typing-text');
        if (typingText && config.personal.titles) {
            typeWriter(config.personal.titles, typingText);
        }
        
        // Set description
        const description = document.getElementById('hero-description');
        if (description && config.personal.about.description) {
            description.innerHTML = config.personal.about.description;
        }
    }
    
    // Render social links
    if (socialLinks) {
        renderSocialLinks(socialLinks, 'hero-social', 6);
    }
}

function typeWriter(titles, element, titleIndex = 0, charIndex = 0, isDeleting = false) {
    if (!titles || titles.length === 0) return;
    
    const currentTitle = titles[titleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseEnd = 2000;
    const pauseStart = 500;
    
    if (!isDeleting && charIndex <= currentTitle.length) {
        element.textContent = currentTitle.substring(0, charIndex);
        charIndex++;
        setTimeout(() => typeWriter(titles, element, titleIndex, charIndex, false), typingSpeed);
    } else if (isDeleting && charIndex >= 0) {
        element.textContent = currentTitle.substring(0, charIndex);
        charIndex--;
        setTimeout(() => typeWriter(titles, element, titleIndex, charIndex, true), typingSpeed);
    } else if (!isDeleting && charIndex > currentTitle.length) {
        setTimeout(() => typeWriter(titles, element, titleIndex, currentTitle.length, true), pauseEnd);
    } else if (isDeleting && charIndex < 0) {
        titleIndex = (titleIndex + 1) % titles.length;
        setTimeout(() => typeWriter(titles, element, titleIndex, 0, false), pauseStart);
    }
}

// ===================================
// About Section
// ===================================
function initAboutSection() {
    const config = appData.siteConfig;
    
    if (config) {
        const description = document.getElementById('about-description');
        if (description && config.personal.about.description) {
            description.innerHTML = `<p>${config.personal.about.description}</p>`;
        }
        
        const location = document.getElementById('about-location');
        if (location) {
            location.textContent = config.personal.location;
        }
    }
}

// ===================================
// Experience Section
// ===================================
function initExperienceSection() {
    const experience = appData.experience;
    const timeline = document.getElementById('experience-timeline');
    
    if (!experience || !timeline) return;
    
    timeline.innerHTML = experience.map(company => `
        <div class="timeline-item">
            <div class="timeline-card">
                <div class="company-header">
                    <img src="${company.logo}" alt="${company.company}" class="company-logo">
                    <div class="company-info">
                        <h3>${company.company}</h3>
                        <a href="${company.url}" target="_blank" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Visit Website
                        </a>
                    </div>
                </div>
                ${company.positions.map(position => `
                    <div class="position">
                        <div class="position-header">
                            <h4 class="position-title">${position.title}</h4>
                            <span class="position-date">${position.startDate} - ${position.endDate}</span>
                        </div>
                        <ul class="responsibilities">
                            ${position.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ===================================
// Education Section
// ===================================
function initEducationSection() {
    const education = appData.education;
    const grid = document.getElementById('education-grid');
    
    if (!education || !grid) return;
    
    grid.innerHTML = education.map(institution => `
        <div class="education-card">
            <img src="${institution.logo}" alt="${institution.institution}" class="education-logo">
            <h3 class="education-institution">
                <a href="${institution.url}" target="_blank" rel="noopener noreferrer">
                    ${institution.institution}
                </a>
            </h3>
            ${institution.degrees.map(degree => `
                <div class="degree">
                    <div class="degree-title">${degree.title}</div>
                    <div class="degree-date">${degree.startDate} - ${degree.endDate}</div>
                    ${degree.description ? `<p>${degree.description}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `).join('');
}

// ===================================
// Projects Section
// ===================================
function initProjectsSection() {
    const portfolioItems = appData.portfolioItems;
    const projectsGrid = document.getElementById('projects-grid');
    
    if (!portfolioItems || !projectsGrid) return;
    
    // Filter to get non-game projects (focus on software engineering)
    const projects = portfolioItems.filter(item => 
        item.visible && 
        item.category !== 'other projects' &&
        (item.category === 'web application' || 
         item.category === 'windows application' ||
         item.category === 'mobile application' ||
         (item.category === 'game development' && item.highlighted))
    );
    
    // Render projects
    projectsGrid.innerHTML = projects.map(project => createProjectCard(project)).join('');
    
    // Initialize filters
    initProjectFilters(projects);
}

function createProjectCard(project) {
    const iconMap = {
        'unity': 'fab fa-unity',
        'unreal': 'fas fa-cube',
        'django': 'fab fa-python',
        'web': 'fas fa-globe',
        'python': 'fab fa-python',
        'csharp': 'fas fa-code',
        'cpp': 'fas fa-code',
        'android': 'fab fa-android',
        'design': 'fas fa-palette',
        'music': 'fas fa-music'
    };
    
    const icon = iconMap[project.iconType] || 'fas fa-code';
    
    return `
        <div class="project-card" data-category="${project.category}">
            ${project.image ? `<img src="${project.image}" alt="${project.title}" class="project-image">` : ''}
            <div class="project-content">
                <h3 class="project-title">
                    <i class="${icon}"></i> ${project.title}
                </h3>
                ${project.tags && project.tags.length > 0 ? `
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
                <a href="${project.link}" class="project-link" ${project.opennewtab ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                    View Project <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

function initProjectFilters(projects) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    setTimeout(() => card.classList.add('fade-in'), 10);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===================================
// Games Section
// ===================================
function initGamesSection() {
    const gamesShowcase = appData.gamesShowcase;
    const gamesGrid = document.getElementById('games-grid');
    
    if (!gamesShowcase || !gamesGrid) return;
    
    const games = gamesShowcase.highlighted?.filter(game => game.visible) || [];
    
    gamesGrid.innerHTML = games.map(game => `
        <a href="${game.link}" class="game-card" target="_blank" rel="noopener noreferrer">
            <img src="${game.image}" alt="${game.title}" class="game-image">
            <div class="game-content">
                <h3 class="game-title">${game.title}</h3>
            </div>
        </a>
    `).join('');
}

// ===================================
// Contact Section
// ===================================
function initContactSection() {
    const socialLinks = appData.socialLinks;
    
    // Render social links
    if (socialLinks) {
        renderSocialLinks(socialLinks, 'contact-social', 8);
    }
    
    // Handle form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Create mailto link
    const mailtoLink = `mailto:kenan.ege99@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset form
    e.target.reset();
}

// ===================================
// Footer
// ===================================
function initFooter() {
    const footer = appData.footer;
    const socialLinks = appData.socialLinks;
    
    if (footer) {
        // Set footer name
        const footerName = document.getElementById('footer-name');
        if (footerName && footer.profile) {
            footerName.textContent = footer.profile.title;
        }
        
        // Set footer subtitle
        const footerSubtitle = document.getElementById('footer-subtitle');
        if (footerSubtitle && footer.profile) {
            footerSubtitle.textContent = footer.profile.subtitle;
        }
        
        // Set footer location
        const footerLocation = document.getElementById('footer-location');
        if (footerLocation && footer.profile) {
            footerLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${footer.profile.location}`;
        }
        
        // Set copyright
        const footerCopyright = document.getElementById('footer-copyright');
        if (footerCopyright && footer.copyright) {
            const year = footer.copyright.showYear ? new Date().getFullYear() : '';
            footerCopyright.textContent = `© ${year} ${footer.copyright.name}. ${footer.copyright.text}`;
        }
        
        // Set credits
        const footerCredits = document.getElementById('footer-credits');
        if (footerCredits && footer.credits) {
            footerCredits.textContent = footer.credits.text;
        }
    }
    
    // Render social links
    if (socialLinks) {
        renderSocialLinks(socialLinks, 'footer-social', 8);
    }
}

// ===================================
// Social Links Helper
// ===================================
function renderSocialLinks(socialLinks, containerId, maxLinks = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const visibleLinks = socialLinks.filter(link => link.visible).slice(0, maxLinks);
    
    container.innerHTML = visibleLinks.map(link => {
        const iconClass = link.iconType === 'ionicon' 
            ? `ion ${link.icon}` 
            : `${link.iconType === 'fontawesome' ? 'fab' : 'fas'} ${link.icon}`;
        
        return `
            <a href="${link.url}" 
               class="social-icon" 
               target="_blank" 
               rel="noopener noreferrer"
               aria-label="${link.platform}"
               title="${link.platform}">
                <i class="${iconClass}"></i>
            </a>
        `;
    }).join('');
}

// ===================================
// Scroll Effects
// ===================================
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(`
        .timeline-item,
        .education-card,
        .project-card,
        .game-card,
        .about-text,
        .about-skills
    `);
    
    elementsToAnimate.forEach(el => observer.observe(el));
}

// ===================================
// Back to Top Button
// ===================================
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Utility Functions
// ===================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Performance Optimization
// ===================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
const preloadResources = () => {
    const criticalImages = [
        'assets/images/avatar4.gif'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

// Call preload on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadResources);
} else {
    preloadResources();
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Console welcome message
console.log('%c👾 Welcome to Kenan Ege\'s Portfolio! 👾', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with bunch of 0\'s and 1\'s', 'color: #7c3aed; font-size: 14px;');
console.log('%cInterested in the code? Check out: https://github.com/KenanAegean', 'color: #8892ab; font-size: 12px;');
