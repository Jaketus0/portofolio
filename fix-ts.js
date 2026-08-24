const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(fullPath, content);
}

// 1. Controllers req.params.id / req.params.slug
const controllersDir = path.join(__dirname, 'server/controllers');
const controllers = fs.readdirSync(controllersDir);
for (const file of controllers) {
    if (file.endsWith('.ts')) {
        let content = fs.readFileSync(path.join(controllersDir, file), 'utf8');
        content = content.replace(/req\.params\.id/g, '(req.params.id as string)');
        content = content.replace(/req\.params\.slug/g, '(req.params.slug as string)');
        content = content.replace(/req\.params\.imageId/g, '(req.params.imageId as string)');
        fs.writeFileSync(path.join(controllersDir, file), content);
    }
}

// 2. ua-parser-js
replaceInFile('server/controllers/visitor.controller.ts', [
    ["import parser from 'ua-parser-js';", "import { UAParser } from 'ua-parser-js';"],
    ["const parsedUA = parser(userAgent);", "const parsedUA = new UAParser(userAgent || '').getResult();"]
]);

// 3. media.service.ts null to undefined
replaceInFile('server/services/media.service.ts', [
    ["let width = null;", "let width: number | undefined = undefined;"],
    ["let height = null;", "let height: number | undefined = undefined;"],
    ["width = metadata.width || null;", "width = metadata.width || undefined;"],
    ["height = metadata.height || null;", "height = metadata.height || undefined;"]
]);

// 4. jwt.ts
replaceInFile('server/utils/jwt.ts', [
    ["expiresIn: '15m'", "expiresIn: 15 * 60"],
    ["expiresIn: '7d'", "expiresIn: 7 * 24 * 60 * 60"],
    ["expiresIn: '30d'", "expiresIn: 30 * 24 * 60 * 60"]
]);

// 5. src/app/admin/page.tsx cn import
replaceInFile('src/app/admin/page.tsx', [
    ["import { Users, Eye, MousePointerClick, MessageSquare } from 'lucide-react';", "import { Users, Eye, MousePointerClick, MessageSquare } from 'lucide-react';\nimport { cn } from '../../lib/utils';"]
]);

// 6. src/app/login/page.tsx react-form import
replaceInFile('src/app/login/page.tsx', [
    ["import { useForm } from 'react-form'; // Actually, let's use a simpler custom form or react-hook-form\n", ""]
]);

console.log('Fixes applied successfully.');
