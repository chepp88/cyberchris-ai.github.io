// js/three-hero.js - Subtle Neon Cyber Background
let scene, camera, renderer;
let nodes = [];
let connections = [];
let particles = [];

function initThreeHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

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

    const cyan = 0x00f5d4;
    const magenta = 0xff00aa;
    const violet = 0x6b00ff;

    // Nodes
    const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    for (let i = 0; i < 80; i++) {
        const material = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? cyan : magenta 
        });
        const node = new THREE.Mesh(nodeGeometry, material);
        
        node.position.x = (Math.random() - 0.5) * 70;
        node.position.y = (Math.random() - 0.5) * 40;
        node.position.z = (Math.random() - 0.5) * 20;
        
        node.userData = { 
            speed: 0.0005 + Math.random() * 0.001,
            pulse: Math.random() * Math.PI * 2 
        };
        
        scene.add(node);
        nodes.push(node);
    }

    // Connections
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x00f5d4, 
        transparent: true, 
        opacity: 0.15 
    });

    for (let i = 0; i < 40; i++) {
        const points = [];
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        if (startNode && endNode) {
            points.push(startNode.position.clone());
            points.push(endNode.position.clone());
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
            connections.push({ line, start: startNode, end: endNode });
        }
    }

    // Particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i]     = (Math.random() - 0.5) * 80;
        posArray[i + 1] = (Math.random() - 0.5) * 50;
        posArray[i + 2] = (Math.random() - 0.5) * 30;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: violet,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particles.push(particleSystem);

    function animate() {
        requestAnimationFrame(animate);

        nodes.forEach(node => {
            node.position.y += Math.sin(Date.now() * node.userData.speed) * 0.008;
            node.scale.setScalar(1 + Math.sin(Date.now() * 0.003 + node.userData.pulse) * 0.2);
        });

        camera.position.x = Math.sin(Date.now() * 0.0001) * 3;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Load Three.js and init
window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    script.onload = initThreeHero;
    document.head.appendChild(script);
});
