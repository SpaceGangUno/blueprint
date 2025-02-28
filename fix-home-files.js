import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fix the style object in a file
function fixFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the style object by adding a comma between properties
    content = content.replace(/style={{ width: '300%' transform:/g, "style={{ width: '300%', transform:");
    
    // Write the fixed content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Fixed ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
}

// Fix the files
fixFile(path.join(__dirname, 'src/pages/Home.tsx'));
fixFile(path.join(__dirname, 'src/pages/Home.new.tsx'));
fixFile(path.join(__dirname, 'src/pages/Home.fixed.tsx'));

console.log('All files fixed!');
