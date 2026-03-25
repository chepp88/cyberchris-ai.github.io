/**
 * js/main.js - Unified CyberSolutions Engine
 */
window.nodes = [];
window.lineMaterial = null;
const mouse = { x: 0, y: 0 };

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-button');
    const viewToggle = document.getElementById('view-mode-toggle');
    const appsGrid = document.getElementById('apps-grid');

    // 1. Theme Initialization
    if (localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThreeColors();
        });
    }

    // 2. View Mode Toggle (Grid/List)
    if (viewToggle && appsGrid) {
        viewToggle.addEventListener('change', () => {
            appsGrid.classList.toggle('list-view', viewToggle.checked);
            const label = document.getElementById('view-mode-label');
            if (label) label.innerText = viewToggle.checked ? 'List' : 'Grid';
        });
    }

    // 3. Three.js Initialization
    if (document.getElementById('hero-canvas') && typeof THREE !== 'undefined') {
        initThreeHero();
    }

    // Mouse Tracking for 3D Parallax
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });
});

function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const colors = getThemeColors();
    window.lineMaterial = new THREE.LineBasicMaterial({ color: colors.cyan, transparent: true, opacity: 0.2 });

    // Create Nodes
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    for (let i = 0; i < 60; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? colors.cyan : colors.magenta });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 70, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 20);
        scene.add(mesh);
        window.nodes.push(mesh);
    }

    function animate() {
        requestAnimationFrame(animate);
        camera.position.x += (mouse.x * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouse.y * 10 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    animate();
}

function getThemeColors() {
    const style = getComputedStyle(document.body);
    return {
        cyan: style.getPropertyValue('--cyan').trim(),
        magenta: style.getPropertyValue('--magenta').trim()
    };
}

function updateThreeColors() {
    if (!window.lineMaterial) return;
    const colors = getThemeColors();
    window.lineMaterial.color.set(colors.cyan);
    window.nodes.forEach((n, i) => n.material.color.set(i % 2 === 0 ? colors.cyan : colors.magenta));
}
