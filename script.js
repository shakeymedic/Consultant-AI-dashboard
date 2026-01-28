// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initProgressBar();
    initFadeInAnimations();
    initCopyableCode();
    initPresentationMode();
    initPromptTabs();
});

// ===== THEME TOGGLE =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// ===== PROGRESS BAR =====
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// ===== FADE IN ANIMATIONS =====
function initFadeInAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ===== COPYABLE CODE BLOCKS =====
function initCopyableCode() {
    document.querySelectorAll('code.copyable').forEach(block => {
        block.addEventListener('click', async function() {
            try {
                await navigator.clipboard.writeText(this.textContent);
                this.classList.add('copied');
                setTimeout(() => {
                    this.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

// ===== PRESENTATION MODE =====
let currentSlide = 0;
let totalSlides = 0;

function initPresentationMode() {
    const slides = document.querySelectorAll('.pres-slide');
    totalSlides = slides.length;
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!document.body.classList.contains('presentation-mode')) return;
        
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'Escape') {
            setMode('website');
        }
    });
    
    // Touch navigation for mobile
    let touchStartX = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!document.body.classList.contains('presentation-mode')) return;
        
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });
}

function setMode(mode) {
    const tabs = document.querySelectorAll('.mode-tab');
    tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    
    if (mode === 'presentation') {
        document.body.classList.add('presentation-mode');
        showSlide(0);
        document.querySelector('.keyboard-hint').classList.add('visible');
    } else {
        document.body.classList.remove('presentation-mode');
        document.querySelector('.keyboard-hint').classList.remove('visible');
    }
}

function showSlide(index) {
    const slides = document.querySelectorAll('.pres-slide');
    
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    
    currentSlide = index;
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Scroll to top of slide
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        showSlide(currentSlide - 1);
    }
}

// ===== PROMPT TABS =====
function initPromptTabs() {
    // Show first category by default
    showPromptCategory('sops');
}

function showPromptCategory(category) {
    // Update tabs
    document.querySelectorAll('.prompt-tab').forEach(tab => {
        tab.classList.toggle('active', tab.textContent.toLowerCase().includes(category.replace('prompts-', '').substring(0, 4)));
    });
    
    // Update categories
    document.querySelectorAll('.prompt-category').forEach(cat => {
        cat.classList.toggle('active', cat.id === 'prompts-' + category);
    });
}

// Update the onclick handlers for prompt tabs
document.addEventListener('DOMContentLoaded', function() {
    const tabMappings = {
        'SOPs & Guidelines': 'sops',
        'Management': 'management',
        'Education': 'education',
        'Audit & QI': 'audit',
        'Communication': 'communication'
    };
    
    document.querySelectorAll('.prompt-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const text = this.textContent.trim();
            const category = tabMappings[text];
            if (category) {
                // Update active states
                document.querySelectorAll('.prompt-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Show category
                document.querySelectorAll('.prompt-category').forEach(cat => {
                    cat.classList.toggle('active', cat.id === 'prompts-' + category);
                });
            }
        });
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // If in presentation mode, switch to website mode first
            if (document.body.classList.contains('presentation-mode')) {
                setMode('website');
            }
            
            setTimeout(() => {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });
});

// ===== PRINT HANDLING =====
window.addEventListener('beforeprint', function() {
    // Show all slides for printing
    document.querySelectorAll('.pres-slide').forEach(slide => {
        slide.style.display = 'block';
    });
});

window.addEventListener('afterprint', function() {
    // Restore slide display
    if (document.body.classList.contains('presentation-mode')) {
        showSlide(currentSlide);
    }
});
