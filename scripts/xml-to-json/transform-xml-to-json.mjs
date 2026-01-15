import { XMLParser } from 'fast-xml-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Transform all the XML files in /motion-xml to JSONs and store them in /motion-json
const XML_PATH = path.join(__dirname, 'motion-xml');
const JSON_PATH = path.join(__dirname, 'motion-json');

// Helper: recursively get all files with extension
async function getAllFiles(dir, ext) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                return getAllFiles(fullPath, ext);
            }
            if (entry.isFile() && fullPath.endsWith(ext)) {
                return [fullPath];
            }
            return [];
        })
    );
    return files.flat();
}

// Helper: ensure directory exists
async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

// Helper: delete all files in a directory recursively
async function clearDirectory(dir) {
    try {
        await fs.rm(dir, { recursive: true, force: true });
    } catch {}
    await fs.mkdir(dir, { recursive: true });
}

// Placeholder transform
function transformXMLToJSON(xml) {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: ''
    });
    const obj = parser.parse(xml);

    const motion = obj.Motion;
    if (!motion) throw new Error('No <Motion> found');

    const duration = Number(motion.duration || 0);
    const frameRate = motion.source?.Source?.frameRate ? Number(motion.source.Source.frameRate) : 30;

    const keyframesRaw = [].concat(motion.Keyframe || []);
    const keyframes = keyframesRaw.map((kf) => {
        const keyframe = { index: Number(kf.index || 0) };

        ['x', 'y', 'scaleX', 'scaleY', 'rotation'].forEach((attr) => {
            if (kf[attr] !== undefined) keyframe[attr] = Number(kf[attr]);
        });

        const easeNode = kf.tweens?.CustomEase;
        if (easeNode) {
            const points = [].concat(easeNode['geom:Point'] || easeNode.Point || []);
            if (points.length >= 2) {
                keyframe.ease = {
                    x1: Number(points[0].x),
                    y1: Number(points[0].y),
                    x2: Number(points[1].x),
                    y2: Number(points[1].y)
                };
            }
        }

        return keyframe;
    });

    return { duration, frameRate, keyframes };
}

// Example usage:
// const fs = require('fs');
// const xml = fs.readFileSync("anim.xml", "utf-8");
// console.log(transformXML(xml));

async function main() {
    await clearDirectory(JSON_PATH);

    const allXMLFilePaths = await getAllFiles(XML_PATH, '.xml');

    for (const xmlPath of allXMLFilePaths) {
        const xmlContent = await fs.readFile(xmlPath, 'utf8');
        const jsonObject = transformXMLToJSON(xmlContent);
        const relativePath = path.relative(XML_PATH, xmlPath);
        const jsonPath = path.join(JSON_PATH, relativePath.replace(/\.xml$/i, '.json'));
        await ensureDir(path.dirname(jsonPath));
        await fs.writeFile(jsonPath, JSON.stringify(jsonObject, null, 2), 'utf8');
    }

    console.log(`Processed ${allXMLFilePaths.length} XML files.`);
}

main().catch(console.error);
