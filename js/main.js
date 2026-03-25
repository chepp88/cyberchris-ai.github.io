/**
 * js/main.js - Unified CyberSolutions Engine
 * Features: Three.js Hero, Theme Switcher, and Category Filtering
 */

let scene, camera, renderer, nodes = [], connections = [];
let lineMaterial;
const mouse = { x: 0, y: 0 };

// --- 1. Three.js Hero Background ---
function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const getColors = () => {
        const style = getComputedStyle(document.body);
        return {
            cyan: new THREE.Color(style.getPropertyValue('--cyan').trim() || '#00f5d4'),
            magenta: new THREE.Color(style.getPropertyValue('--magenta').trim() || '#ff00f5')
        };
    };

    let theme = getColors();

    // Create Nodes
    const nodeGeo = new THREE.SphereGeometry(0.3, 12, 12);
    for (let i = 0; i < 80; i++) {
        const mat = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? theme.cyan : theme.magenta 
        });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*45, (Math.random()-0.5)*20);
        node.userData = { 
            speed: 0.0005 + Math.random() * 0.001, 
            pulse: Math.random() * Math.PI 
        };
        scene.add(node);
        nodes.push(node);
    }

    // Create Connections
    lineMaterial = new THREE.LineBasicMaterial({ 
        color: theme.cyan, 
        transparent: true, 
        opacity: 0.15 
    });
    for (let i = 0; i < 45; i++) {
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        const end = nodes[Math.floor(Math.random() * nodes.length)];
        if (start !== end) {
            const geo = new THREE.BufferGeometry().setFromPoints([start.position, end.position]);
            const line = new THREE.Line(geo, lineMaterial);
            scene.add(line);
            connections.push({ line, start, end });
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now();

        // Node Movement
        nodes.forEach(n => {
            n.position.y += Math.sin(now * n.userData.speed) * 0.01;
            n.scale.setScalar(1 + Math.sin(now * 0.002 + n.userData.pulse) * 0.2);
        });

        // Update Lines
        connections.forEach(c => {
            const pos = c.line.geometry.attributes.position.array;
            pos[0] = c.start.position.x; pos[1] = c.start.position.y; pos[2] = c.start.position.z;
            pos[3] = c.end.position.x; pos[4] = c.end.position.y; pos[5] = c.end.position.z;
            c.line.geometry.attributes.position.needsUpdate = true;
        });

        // Parallax Camera
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.05;
        camera.position.y += (-(mouse.y * 5) - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// --- 2. Theme & Filter Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle-button');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const featureItems = document.querySelectorAll('.feature-item');

    // Persistence Check
    if(localStorage.getItem('theme') === 'light') body.classList.add('light-mode');

    // Theme Toggle Click
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Sync Three.js Colors
            const style = getComputedStyle(document.body);
            const newCyan = new THREE.Color(style.getPropertyValue('--cyan').trim());
            const newMagenta = new THREE.Color(style.getPropertyValue('--magenta').trim());

            if (lineMaterial) lineMaterial.color.copy(newCyan);
            nodes.forEach((n, i) => {
                n.material.color.copy(i % 2 === 0 ? newCyan : newMagenta);
            });
        });
    }

    // Category Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            featureItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => item.classList.add('visible'), 10);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('visible');
                }
            });
        });
    });

    // Mouse tracker
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });
});

// Load Three.js Library and Start
const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
script.onload = initThreeHero;
document.head.appendChild(script);
// --- Enhanced Category Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const featureItems = document.querySelectorAll('.feature-item');

// Initial reveal for items already on screen
featureItems.forEach((item, index) => {
    setTimeout(() => item.classList.add('visible'), index * 100);
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active Button State
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        featureItems.forEach((item) => {
            const category = item.getAttribute('data-category');
            
            // Step 1: Hide everything first
            item.classList.remove('visible');
            
            // Step 2: After a brief delay, show/hide based on filter
            setTimeout(() => {
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Trigger reflow for animation
                    void item.offsetWidth; 
                    item.classList.add('visible');
                } else {
                    item.classList.add('hidden');
                }
            }, 300); 
        });
    });
});
