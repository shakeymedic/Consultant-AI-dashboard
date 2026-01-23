// Theme Toggle
function toggleTheme() {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Mode Toggle
function setMode(mode) {
    document.body.classList.toggle('presentation-mode', mode === 'presentation');
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    localStorage.setItem('mode', mode);
    
    // Reset to top of slide or page
    if (mode === 'presentation') {
        const firstSlide = document.getElementById('pres-1');
        if (firstSlide) firstSlide.scrollIntoView();
    } else {
        window.scrollTo(0,0);
    }
}

// Scenario Tabs
function showScenario(id) {
    document.querySelectorAll('.scenario-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.scenario-panel').forEach(panel => panel.classList.remove('active'));
    
    // Find button with specific onclick handler (simplified selector)
    const btn = Array.from(document.querySelectorAll('.scenario-tab')).find(b => b.getAttribute('onclick').includes(id));
    if(btn) btn.classList.add('active');
    
    const panel = document.getElementById('scenario-' + id);
    if(panel) panel.classList.add('active');
}

// Prompt Category Tabs
function showPromptCategory(id) {
    document.querySelectorAll('.prompt-cat-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.prompt-category').forEach(cat => cat.classList.remove('active'));
    
    const btn = Array.from(document.querySelectorAll('.prompt-cat-tab')).find(b => b.getAttribute('onclick').includes(id));
    if(btn) btn.classList.add('active');

    const cat = document.getElementById('prompts-' + id);
    if(cat) cat.classList.add('active');
}

// Progress Bar
function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    const bar = document.getElementById('progressBar');
    if(bar) bar.style.width = progress + '%';
}
window.addEventListener('scroll', updateProgressBar);

// Modal Data
const modalData = {
    fracture: {
        title: 'AI Fracture Detection',
        content: `
            <div class="modal-section"><h4>Overview</h4><p>AI-assisted detection of fractures on X-rays, particularly subtle injuries like scaphoid fractures, rib fractures, and hip fractures that are commonly missed.</p></div>
            <div class="modal-section"><h4>Evidence</h4><p>NICE HTG739 meta-analysis shows <strong>9.5% average sensitivity improvement</strong> (95% CI: 6.8–12.1%). Four technologies recommended: Annalise CXR, BoneView, RBfracture, Milvue.</p></div>
            <div class="modal-section"><h4>UK Deployments</h4><p>50+ NHS Trusts using AI fracture detection. Common implementations in A&E, urgent care, and virtual fracture clinics.</p></div>
            <div class="modal-warning"><p><strong>⚠️ Warning:</strong> AI augments but doesn't replace clinical judgment. You remain accountable for all diagnostic decisions (GMC GMP 2024).</p></div>
        `
    },
    scribes: {
        title: 'AI Clinical Scribes',
        content: `
            <div class="modal-section"><h4>Overview</h4><p>Ambient AI that listens to consultations and generates clinical documentation, reducing documentation burden.</p></div>
            <div class="modal-section"><h4>Evidence</h4><p>St George's TORTUS trial: <strong>47 minutes saved per shift, 13.4% more patients seen</strong>.</p></div>
            <div class="modal-section"><h4>Available Platforms</h4><p>TORTUS AI (NHS AI Exemplar), Heidi Health (DCB0129, Walsall pilot), Dragon Copilot (MHRA Class I).</p></div>
            <div class="modal-warning"><p><strong>⚠️ Warning:</strong> Requires Trust approval, DPIA, Caldicott sign-off.</p></div>
        `
    }
    // ... (Other modal data can be added here)
};

// Modal Functions
function openModal(id) {
    const data = modalData[id];
    if (data) {
        document.getElementById('modalTitle').textContent = data.title;
        document.getElementById('modalBody').innerHTML = data.content;
        document.getElementById('modalOverlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(event) {
    if (!event || event.target === document.getElementById('modalOverlay')) {
        document.getElementById('modalOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Keyboard Navigation & Interaction
document.addEventListener('keydown', function(e) {
    // Escape closes modal
    if (e.key === 'Escape') closeModal();

    const mode = localStorage.getItem('mode') || 'website';
    
    if (mode === 'presentation') {
        handlePresentationNav(e);
    } else {
        handleWebsiteNav(e);
    }
});

function handlePresentationNav(e) {
    const slides = Array.from(document.querySelectorAll('.pres-slide'));
    // Find current visible slide based on scroll position
    let currentIndex = 0;
    
    // Simple heuristic: find slide closest to top of screen
    let minDiff = Infinity;
    slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const diff = Math.abs(rect.top);
        if(diff < minDiff) {
            minDiff = diff;
            currentIndex = index;
        }
    });

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < slides.length - 1) {
            slides[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            slides[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function handleWebsiteNav(e) {
    // Define main sections in order
    const sectionIds = ['hero', 'stats', 'limitations', 'start-here', 'use-today', 'agentic', 'applications', 'implementations', 'platforms', 'scenarios', 'resources'];
    
    // Find current section
    let currentIdIndex = -1;
    let minDiff = Infinity;
    
    sectionIds.forEach((id, index) => {
        const el = document.getElementById(id);
        if(el) {
            const rect = el.getBoundingClientRect();
            // We want the section currently taking up most of the top of the viewport
            // Or the one we just scrolled past
            if (Math.abs(rect.top) < minDiff) {
                minDiff = Math.abs(rect.top);
                currentIdIndex = index;
            }
        }
    });

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIdIndex < sectionIds.length - 1) {
            document.getElementById(sectionIds[currentIdIndex + 1]).scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIdIndex > 0) {
            document.getElementById(sectionIds[currentIdIndex - 1]).scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Fade In Observer
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// Initialize
(function init() {
    // Theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Mode
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'presentation') {
        setMode('presentation');
    }
})();
