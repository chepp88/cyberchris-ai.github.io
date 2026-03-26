/**
 * js/main.js - Unified CyberSolutions Engine
 * Features: Infinite Theme Randomizer & Portfolio Filtering
 */

// Global state for Three.js (if used in other scripts)
window.nodes = [];
window.lineMaterial = null;

document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle-button');

    // --- 1. INFINITE THEME ENGINE ---
    
    /**
     * Applies a HSL-based theme to the entire site
     * @param {number} hue - A value from 0 to 360
     */
    function applyTheme(hue) {
        const primaryHue = hue;
        const accentHue = (primaryHue + 130) % 360; // Offset for aesthetic contrast

        // Update CSS Variables defined in :root
        root.style.setProperty('--main-hue', primaryHue);
        root.style.setProperty('--accent-hue', accentHue);
        
        // Sync Three.js nodes colors if the 3D scene is active
        if (window.nodes && window.nodes.length > 0) {
            const cyan = `hsl(${primaryHue}, 100%, 48%)`;
            const magenta = `hsl(${accentHue}, 100%, 50%)`;
            
            if (window.lineMaterial) window.lineMaterial.color.set(cyan);
            window.nodes.forEach((n, i) => {
                n.material.color.set(i % 2 === 0 ? cyan : magenta);
            });
        }
    }

    // Load user's saved theme from localStorage, or default to Cyber Cyan (170)
    const savedHue = localStorage.getItem('userHue') || 170;
    applyTheme(parseInt(savedHue));

    // Handle Theme Randomizer Click
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newHue = Math.floor(Math.random() * 360);
            applyTheme(newHue);
            localStorage.setItem('userHue', newHue);
        });
    }

    // --- 2. CATEGORY FILTERING LOGIC ---
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const features = document.querySelectorAll('.feature-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // UI Feedback: Update active button state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/Hide items based on category
            features.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
