import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the API endpoint from environment variable or use default
const API_ENDPOINT = process.env.API_ENDPOINT || 'http://localhost:3000';

async function packageExtension() {
  const output = fs.createWriteStream(join(__dirname, '../dist/loyabuzz-ai-assistant.zip'));
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  return new Promise((resolve, reject) => {
    output.on('close', () => {
      console.log('Extension packaged successfully!');
      resolve();
    });
    
    archive.on('error', (err) => {
      reject(err);
    });
    
    archive.pipe(output);
    
    // Add manifest
    archive.file(join(__dirname, '../manifest.json'), { name: 'manifest.json' });
    
    // Add assets
    archive.directory(join(__dirname, '../assets'), 'assets');
    
    // Add styles
    archive.directory(join(__dirname, '../styles'), 'styles');
    
    // Inject API endpoint into widget.js
    let widgetCode = fs.readFileSync(join(__dirname, '../scripts/widget.js'), 'utf8');
    widgetCode = `window.LOYABUZZ_API_ENDPOINT = '${API_ENDPOINT}';\n${widgetCode}`;
    
    // Add modified widget.js
    archive.append(widgetCode, { name: 'scripts/widget.js' });
    
    archive.finalize();
  });
}

packageExtension().catch(console.error); 