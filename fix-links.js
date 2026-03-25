const fs = require('fs');
const path = require('path');

// 1. Fix the main index.html first (the "Software Suite" button)
const indexRef = path.join(__dirname, 'index.html');
if (fs.existsSync(indexRef)) {
    let content = fs.readFileSync(indexRef, 'utf8');
    content = content.replace(/href="apps\.html"/g, 'href="projects/tools/apps.html"');
    fs.writeFileSync(indexRef, content);
    console.log('✅ Updated Software Suite button in index.html');
}

// 2. Fix all files inside projects/tools/
const toolsDir = path.join(__dirname, 'projects', 'tools');
if (fs.existsSync(toolsDir)) {
    fs.readdirSync(toolsDir).forEach(file => {
        if (file.endsWith('.html')) {
            const filePath = path.join(toolsDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/href="css\//g, 'href="../../css/');
            content = content.replace(/src="js\//g, 'src="../../js/');
            content = content.replace(/src="img\//g, 'src="../../img/');
            content = content.replace(/href="index\.html"/g, 'href="../../index.html"');
            fs.writeFileSync(filePath, content);
            console.log('✅ Fixed links in: ' + file);
        }
    });
}
