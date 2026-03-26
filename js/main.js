document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle-button');

    // --- 1. INFINITE THEME ENGINE ---
    
    function applyTheme(hue) {
        const primaryHue = hue;
        const accentHue = (primaryHue + 130) % 360; // Offset for contrast

        root.style.setProperty('--main-hue', primaryHue);
        root.style.setProperty('--accent-hue', accentHue);
        
        // Update Three.js nodes if they exist
        if (window.nodes && window.nodes.length > 0) {
            const cyan = `hsl(${primaryHue}, 100%, 48%)`;
            const magenta = `hsl(${accentHue}, 100%, 50%)`;
            
            if(window.lineMaterial) window.lineMaterial.color.set(cyan);
            window.nodes.forEach((n, i) => {
                n.material.color.set(i % 2 === 0 ? cyan : magenta);
            });
        }
    }

    // Load saved theme or default
    const savedHue = localStorage.getItem('userHue') || 170;
    applyTheme(parseInt(savedHue));

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newHue = Math.floor(Math.random() * 360);
            applyTheme(newHue);
            localStorage.setItem('userHue', newHue);
        });
    }

    // --- 2. FILTERING LOGIC ---
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const features = document.querySelectorAll('.feature-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            features.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
