import sharp from 'sharp';
import { promises as fs } from 'fs';

async function convertSvgToPng() {
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile('./assets/header.svg');
    
    // Convert to PNG with higher resolution for better quality
    await sharp(svgBuffer)
      .resize(1200, 300) // Doubled size for better quality
      .png()
      .toFile('./assets/header.png');
    
    console.log('Successfully converted header.svg to header.png');
  } catch (error) {
    console.error('Error converting file:', error);
  }
}

convertSvgToPng(); 