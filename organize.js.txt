const fs = require('fs');
const path = require('path');

// 1. Define the new structure
const folders = [
    'projects/games',
    'projects/visualizers',
    'projects/tools',
    'assets/models',
    'assets/textures'
];

// 2. Map files to their new homes
const moveMap = {
    // Games
    '3D Chess.html': 'projects/games/3D Chess.html',
    '3d-pong.html': 'projects/games/3d-pong.html',
    'solitaire.html': 'projects/games/solitaire.html',
    // Visualizers
    '3D DNA Visualizer.html': 'projects/visualizers/3D DNA Visualizer.html',
    '3D Molecule Viewer.html': 'projects/visualizers/3D Molecule Viewer.html',
    // Assets
    'Planet_1.gltf': 'assets/models/Planet_1.gltf',
    'brushed_aluminum.jpg': 'assets/textures/brushed_aluminum.jpg'
};

// Create folders
folders.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Move files and update internal links
Object.keys(moveMap).forEach(file => {
    const oldPath = path.join(__dirname, file);
    const newPath = path.join(__dirname, moveMap[file]);

    if (fs.existsSync(oldPath)) {
        if (file.endsWith('.html')) {
            let content = fs.readFileSync(oldPath, 'utf8');
            // Update relative paths (moving from root to 2 levels deep)
            content = content.replace(/href="style\.css"/g, 'href="../../style.css"');
            content = content.replace(/src="script\.js"/g, 'src="../../script.js"');
            fs.writeFileSync(oldPath, content);
        }
        fs.renameSync(oldPath, newPath);
        console.log(`Moved: ${file} -> ${moveMap[file]}`);
    }
});