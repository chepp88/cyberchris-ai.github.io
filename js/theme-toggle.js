/**
 * js/theme-toggle.js - Modern Theme Switcher
 * Handles light-mode/dark-mode state and persistence
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    // 1. Create the toggle button dynamically (or target an existing one)
    // You can also just place this HTML in your nav: <button id="theme-toggle" class="filter-btn">Toggle Theme</button>
    let toggleBtn = document.getElementById('theme-toggle');
    
    if (!toggleBtn) {
        // Fallback: Create it if it doesn't exist in your HTML
        toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle';
        toggleBtn.className = 'filter-btn'; // Uses your existing CSS class
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.top = '100px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = '1000';
        document.body.appendChild(toggleBtn);
    }

    // 2. Check for saved preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        body.classList.add('light-mode');
        updateBtnText(true);
    } else {
        updateBtnText(false);
    }

    // 3. Toggle Logic
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        updateBtnText(isLight);
        
        // Add a little "glitch" or scale effect on click
        toggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => toggleBtn.style.transform = 'scale(1)', 100);
    });

    function updateBtnText(isLight) {
        toggleBtn.innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
    }
});
