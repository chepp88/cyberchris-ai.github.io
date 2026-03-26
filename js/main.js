/**
 * CyberSolutionsOhio - Unified Frontend Logic
 * Includes: Three.js Hero, Theme Switcher, and Category Filtering
 */

let scene, camera, renderer, nodeMaterial, lineMaterial, particleMaterial;
let nodes = [];
let connections = [];
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
            cyan: new THREE.Color(style.getPropertyValue('--cyan').trim()),
            magenta: new THREE.Color(style.getPropertyValue('--magenta').trim())
        };
    };

    let theme = getColors();

    // Nodes
    const nodeGeo = new THREE.SphereGeometry(0.3, 12, 12);
    for (let i = 0; i < 80; i++) {
        const mat = new THREE.MeshBasicMaterial({ color: Math.random() > 0.5 ? theme.cyan : theme.magenta });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*45, (Math.random()-0.5)*20);
        node.userData = { speed: 0.0005 + Math.random() * 0.001, pulse: Math.random() * Math.PI };
        scene.add(node);
        nodes.push(node);
    }

    // Connections
    lineMaterial = new THREE.LineBasicMaterial({ color: theme.cyan, transparent: true, opacity: 0.15 });
    for (let i = 0; i < 45; i++) {
        const start = nodes[Math.floor(Math.random() * nodes.length)];
        const end = nodes[Math.floor(Math.random() * nodes.length)];
        const geo = new THREE.BufferGeometry().setFromPoints([start.position, end.position]);
        const line = new THREE.Line(geo, lineMaterial);
        scene.add(line);
        connections.push({ line, start, end });
    }

    function animate() {
        requestAnimationFrame(animate);
        const now = Date.now();

        nodes.forEach(n => {
            n.position.y += Math.sin(now * n.userData.speed) * 0.01;
            n.scale.setScalar(1 + Math.sin(now * 0.002 + n.userData.pulse) * 0.2);
        });

        connections.forEach(c => {
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

// --- 2. Theme & Filter Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const toggleBtn = document.getElementById('theme-toggle-button');
    const filterBtns = document.querySelectorAll
