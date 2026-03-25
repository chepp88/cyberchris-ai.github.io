document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-button');

    // Theme Persistence
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            localStorage.setItem('theme', body.classList.contains('light-mode') ? 'light' : 'dark');
        });
    }

    // Simple Filtering Logic for Core Offerings
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
