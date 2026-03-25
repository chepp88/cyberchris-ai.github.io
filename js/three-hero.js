/**
 * js/three-hero.js - Interactive Neon Cyber Background
 * Features: Dynamic Connections, Mouse Parallax, and Theme Awareness
 */

let scene, camera, renderer, particleSystem;
let nodes = [];
let connections = [];
const mouse = { x: 0, y: 0 };

function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // --- 1. Setup ---
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Get theme colors from CSS variables
    const getThemeColors = () => {
        const style = getComputedStyle(document.body);
        return {
            cyan: new THREE.Color(style.getPropertyValue('--cyan').trim() || '#00f5d4'),
            magenta: new THREE.Color(style.getPropertyValue('--magenta').trim() || '#ff00f5'),
            violet: new THREE.Color(style.getPropertyValue('--violet') || '#6b00ff')
        };
    };

    let colors = getThemeColors();

    // --- 2. Nodes ---
    const nodeGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    for (let i = 0; i < 80; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? colors.cyan : colors.magenta 
        });
        const node = new THREE.Mesh(nodeGeometry, material);
        
        node.position.set((Math.random()-0.5)*75, (Math.random()-0.5)*45, (Math.random()-0.5)*25);
        node.userData = { 
            speed: 0.0004 + Math.random() * 0.0008,
            pulse: Math.random() * Math.PI * 2 
        };
        
        scene.add(node);
        nodes.push(node);
    }

    // --- 3. Dynamic Connections ---
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: colors.cyan, 
        transparent: true, 
        opacity: 0.2 
    });

    for (let i = 0; i < 45; i++) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (startNode !== endNode) {
            const geometry = new THREE.BufferGeometry().setFromPoints([startNode.position, endNode.position]);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            connections.push({ line, start: startNode, end: endNode });
        }
    }

    // --- 4. Particles ---
    const particleGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(300 * 3);
    for (let i = 0; i < 900; i++) posArray[i] = (Math.random() - 0.5) * 90;
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        color: colors.magenta,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // --- 5. Animation Logic ---
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now();

        // Animate Nodes
        nodes.forEach(node => {
            node.position.y += Math.sin(time * node.userData.speed) * 0.01;
            node.scale.setScalar(1 + Math.sin(time * 0.002 + node.userData.pulse) * 0.25);
        });

        // Update Connection Lines to follow Nodes
        connections.forEach(conn => {
            const positions = conn.line.geometry.attributes.position.array;
            positions[0] = conn.start.position.x;
            positions[1] = conn.start.position.y;
            positions[2] = conn.start.position.z;
            positions[3] = conn.end.position.x;
            positions[4] = conn.end.position.y;
            positions[5] = conn.end.position.z;
            conn.line.geometry.attributes.position.needsUpdate = true;
        });

        // Mouse Parallax Camera
        camera.position.x += (mouse.x * 4 - camera.position.x) * 0.05;
        camera.position.y += (-(mouse.y * 4) - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    // --- 6. Events ---
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) - 0.5;
        mouse.y = (e.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Theme Observer: Updates 3D colors when CSS class "light-mode" changes
    const observer = new MutationObserver(() => {
        const newColors = getThemeColors();
        nodes.forEach(n => n.material.color.copy(Math.random() > 0.5 ? newColors.cyan : newColors.magenta));
        lineMaterial.color.copy(newColors.cyan);
        particleMaterial.color.copy(newColors.magenta);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

// Global Loader
window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    script.onload = initThreeHero;
    document.head.appendChild(script);
});
