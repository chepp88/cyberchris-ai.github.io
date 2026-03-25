/**
 * js/filter.js - Sidebar & Search Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const gameCheck = document.getElementById('show-games');
    const utilityCheck = document.getElementById('show-utilities');
    const items = document.querySelectorAll('.feature-item');

    function runFilters() {
        const query = searchBar ? searchBar.value.toLowerCase() : '';
        const showGames = gameCheck ? gameCheck.checked : true;
        const showUtils = utilityCheck ? utilityCheck.checked : true;

        items.forEach(item => {
            const name = item.innerText.toLowerCase();
            const category = item.getAttribute('data-category');
            let visible = name.includes(query);

            if (category === 'game' && !showGames) visible = false;
            if (category === 'utility' && !showUtils) visible = false;

            item.style.display = visible ? 'block' : 'none';
        });
    }

    if (searchBar) searchBar.addEventListener('input', runFilters);
    if (gameCheck) gameCheck.addEventListener('change', runFilters);
    if (utilityCheck) utilityCheck.addEventListener('change', runFilters);
});
