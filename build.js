const fs = require("fs");
const indexSource = fs.readFileSync("index.html", "utf8");
const parts = indexSource.split(/|/);

const header = parts[0];
const footer = parts[2];

// List ALL your files here to sync them
const pages = [
    { filename: "about.html", title: "About | CyberSolutionsOhio" },
    { filename: "services.html", title: "Services | CyberSolutionsOhio" },
    { filename: "contact.html", title: "Contact | CyberSolutionsOhio" },
    { filename: "apps.html", title: "Apps | CyberSolutionsOhio" },
    { filename: "launchpad.html", title: "Other | CyberSolutionsOhio" }
];

pages.forEach(page => {
    if (fs.existsSync(page.filename)) {
        const existingPage = fs.readFileSync(page.filename, "utf8");
        const pageParts = existingPage.split(/|/);
        
        if (pageParts.length >= 3) {
            let finalHtml = header.replace(/<title>.*<\/title>/, `<title>${page.title}</title>`);
            finalHtml += pageParts[1] + footer;
            fs.writeFileSync(page.filename, finalHtml);
            console.log(`🚀 Theme Button Synced to: ${page.filename}`);
        }
    }
});
