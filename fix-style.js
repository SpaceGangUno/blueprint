import fs from 'fs';

// Read the file
const filePath = 'src/pages/Home.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the style object by adding a comma between properties
content = content.replace(/style={{ width: '300%' transform:/g, "style={{ width: '300%', transform:");

// Write the fixed content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Fixed ${filePath}`);
