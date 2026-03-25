/**
 * js/main.js - Unified CyberSolutions Engine
 */

// 1. Global State for Three.js
window.nodes = [];
window.connections = [];
window.lineMaterial = null;
const mouse = { x: 0, y: 0 };

// 2. Three.js Hero Background Logic
function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const style = getComputedStyle(document.body);
    const colors = {
        cyan: style.getPropertyValue('--cyan').trim() || '#00f5d4',
        magenta: style.getPropertyValue('--magenta').trim() || '#ff00f5'
    };

    // Create Nodes
    const nodeGeo = new THREE.SphereGeometry(0.3, 12, 12);
    for (let i = 0; i < 80; i++) {
        const mat = new THREE.MeshBasicMaterial({ 
            color: new THREE.Color(i % 2 === 0 ? colors.cyan : colors.magenta) 
        });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*45, (Math.random()-0.5)*20);
        node.userData = { speed: 0.0005 + Math.random() * 0.001, pulse: Math.random() * Math.PI };
        scene.add(node);
        window.nodes.push(node);
    }

    // Create Connections
    window.lineMaterial = new THREE.LineBasicMaterial({ 
        color: new THREE.Color(colors.cyan), 
        transparent: true, 
        opacity: 0.15 
    });
    
    for (let i = 0; i < 45; i++) {
        const start = window.nodes[Math.floor(Math.random() * window.nodes.length)];
        const end = window.nodes[Math.floor(Math.random() * window.nodes.length)];
        if (start !== end) {
            const geo = new THREE.BufferGeometry().setFromPoints([start.position, end.position]);
            const line = new THREE.Line(geo, window.lineMaterial);
            scene.add(line);
            window.connections.push({ line, start, end });
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now();
        window.nodes.forEach(n => {
            n.position.y += Math.sin(now * n.userData.speed) * 0.01;
            n.scale.setScalar(1 + Math.sin(now * 0.002 + n.userData.pulse) * 0.2);
        });
        window.connections.forEach(c => {
            const pos = c.line.geometry.attributes.position.array;
            pos[0] = c.start.position.x; pos[1] = c.start.position.y; pos[2] = c.start.position.z;
            pos[3] = c.end.position.x; pos[4] = c.end.position.y; pos[5] = c.end.position.z;
            c.line.geometry.attributes.position.needsUpdate = true;
        });
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (-(mouse.y * 5) - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
    }
    animate();
}

// 3. Global Initializer
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle-button');

    // Theme Persistence
    if(localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    // Theme Toggle Logic
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Sync 3D Colors if scene exists
            if (window.lineMaterial) {
                const s = getComputedStyle(document.body);
                const c = s.getPropertyValue('--cyan').trim();
                const m = s.getPropertyValue('--magenta').trim();
                window.lineMaterial.color.set(c);
                window.nodes.forEach((n, i) => n.material.color.set(i % 2 === 0 ? c : m));
            }
        });
    }

    // View Mode Toggle (Grid/List)
    const viewToggle = document.getElementById('view-mode-toggle');
    const appsGrid = document.getElementById('apps-grid');
    if (viewToggle && appsGrid) {
        viewToggle.addEventListener('change', () => {
            appsGrid.classList.toggle('list-view', viewToggle.checked);
            const label = document.getElementById('view-mode-label');
            if (label) label.innerText = viewToggle.checked ? 'List' : 'Grid';
        });
    }

    // Mouse Tracking
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });

    // Run 3D Background if library is present
    if (typeof THREE !== 'undefined') {
        initThreeHero();
    }
});

// 4. Fact Box Logic (Exported to Window for HTML button)
window.getNewFact = async function() {
    const factText = document.getElementById('useless-fact');
    if (!factText) return;
    factText.innerText = "Querying the void...";
    try {
        const res = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        const data = await res.json();
        factText.innerText = data.text;
    } catch (e) { 
        factText.innerText = "The void is currently silent."; 
    }
};
