const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const TARGET_HEIGHT = 2160;
const QUALITY = 90;

const DIRS = [
    { path: path.join(process.cwd(), 'public/gallery/Penang'), category: 'Penang' },
    { path: path.join(process.cwd(), 'public/gallery/Terengganu'), category: 'Terengganu' }
];

const OUTPUT_MANIFEST = path.join(process.cwd(), 'src/components/gallery/gallery-manifest.json');

async function processImages() {
    const manifest = [];
    
    for (const dir of DIRS) {
        if (!fs.existsSync(dir.path)) {
            console.warn(`Directory not found: ${dir.path}`);
            continue;
        }

        const files = fs.readdirSync(dir.path).filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));

        for (const file of files) {
            const filePath = path.join(dir.path, file);
            // Read metadata first
            let metadata = await sharp(filePath).metadata();
            
            // Resize if height > TARGET_HEIGHT
            if (metadata.height > TARGET_HEIGHT) {
                console.log(`Resizing ${file}...`);
                const buffer = await sharp(filePath)
                    .resize({ height: TARGET_HEIGHT })
                    .jpeg({ quality: QUALITY })
                    .toBuffer();
                
                fs.writeFileSync(filePath, buffer);
                // Update metadata after resize
                metadata = await sharp(filePath).metadata();
            }

            manifest.push({
                id: `${dir.category}-${file}`,
                src: `/gallery/${dir.category}/${file}`,
                title: file.replace(/\.(jpg|jpeg|png|webp)$/i, ''),
                category: dir.category,
                width: metadata.width,
                height: metadata.height
            });
        }
    }

    fs.writeFileSync(OUTPUT_MANIFEST, JSON.stringify(manifest, null, 2));
    console.log(`Manifest generated at ${OUTPUT_MANIFEST}`);
}

processImages().catch(console.error);
