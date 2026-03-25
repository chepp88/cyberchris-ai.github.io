document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-bar');
    const gamesToggle = document.getElementById('show-games');
    const utilsToggle = document.getElementById('show-utilities');
    const items = document.querySelectorAll('.feature-item');

    function filterApps() {
        const term = searchInput ? searchInput.value.toLowerCase() : '';
        const showGames = gamesToggle ? gamesToggle.checked : true;
        const showUtils = utilsToggle ? utilsToggle.checked : true;

        items.forEach(item => {
            const title = item.querySelector('h3').innerText.toLowerCase();
            const category = item.getAttribute('data-category');
            
            let isVisible = title.includes(term);
            if (category === 'game' && !showGames) isVisible = false;
            if (category === 'utility' && !showUtils) isVisible = false;

            item.style.display = isVisible ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('input', filterApps);
    if (gamesToggle) gamesToggle.addEventListener('change', filterApps);
    if (utilsToggle) utilsToggle.addEventListener('change', filterApps);
});
