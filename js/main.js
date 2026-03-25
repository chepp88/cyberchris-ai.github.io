// 1. Facts Logic (Global Scope)
const localFacts = [
    "A single cloud can weigh more than a million pounds.",
    "Banging your head against a wall for one hour burns 150 calories.",
    "The person who invented the Frisbee was cremated and made into a Frisbee.",
    "A snail can sleep for three years.",
    "The total weight of all the ants on Earth is about the same as all the humans.",
    "The average person spends 6 months of their lifetime waiting on a red light to turn green.",
    "Sloths can hold their breath longer than dolphins can.",
    "Honey never spoils. You could eat 3,000-year-old honey.",
    "Nintendo was founded in 1889, years before the first lightbulb was sold."
];

async function getNewFact() {
    const factElement = document.getElementById('useless-fact');
    if (!factElement) return;

    factElement.textContent = "Fetching a fresh fact...";

    try {
        const response = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random');
        const data = await response.json();
        factElement.textContent = data.text;
    } catch (error) {
        // Fallback to local facts if API fails
        const randomLocal = localFacts[Math.floor(Math.random() * localFacts.length)];
        factElement.textContent = randomLocal;
        console.error("API Error, using local backup:", error);
    }
}

// 2. Theme Logic (Global Scope)
window.changeTheme = function() {
    const randomHue = Math.floor(Math.random() * 360);
    const neonColor = `hsl(${randomHue}, 100%, 50%)`;
    const glowColor = `hsl(${randomHue}, 100%, 30%)`;

    document.documentElement.style.setProperty('--primary-color', neonColor);
    document.documentElement.style.setProperty('--accent-color', glowColor);
    
    document.body.style.color = neonColor;
    document.querySelectorAll('h1, h2, h3, a, button').forEach(el => {
        el.style.color = neonColor;
        el.style.borderColor = neonColor;
        if(el.tagName === 'BUTTON') {
            el.style.boxShadow = `0 0 15px ${neonColor}`;
        }
    });
    console.log(`Theme changed to Hue: ${randomHue}`);
};

// 3. Page Initialization & Interaction Logic
document.addEventListener('DOMContentLoaded', () => {
    // Load initial fact
    getNewFact();

    // Attach theme toggle if the button exists
    const themeBtn = document.getElementById('theme-toggle-button');
    if (themeBtn) {
        themeBtn.addEventListener('click', window.changeTheme);
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });
});
