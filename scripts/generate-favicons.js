#!/usr/bin/env node

/**
 * Favicon Generator Script
 * Generates PNG favicons from the SVG logo
 * 
 * Usage: npm run generate-favicons
 * 
 * Creates:
 * - favicon-16x16.png
 * - favicon-32x32.png
 * - favicon-180x180.png (Apple touch icon)
 * - favicon-192x192.png
 * - favicon-512x512.png
 * - favicon-maskable-192x192.png
 * - favicon-maskable-512x512.png
 * - favicon.ico
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const scriptsDir = __dirname;
const projectRoot = path.resolve(scriptsDir, '..');
const svgPath = path.join(projectRoot, 'public/favicon.svg');
const publicDir = path.join(projectRoot, 'public');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'favicon-180x180.png' },
  { size: 192, name: 'favicon-192x192.png' },
  { size: 512, name: 'favicon-512x512.png' },
];

const maskableSizes = [
  { size: 192, name: 'favicon-maskable-192x192.png' },
  { size: 512, name: 'favicon-maskable-512x512.png' },
];

async function generateFavicons() {
  console.log('🎨 Generating favicons from SVG...\n');

  try {
    if (!fs.existsSync(svgPath)) {
      throw new Error(`SVG file not found at ${svgPath}`);
    }

    // Generate regular favicons
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate maskable favicons
    for (const { size, name } of maskableSizes) {
      const outputPath = path.join(publicDir, name);
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (use 32x32 as fallback)
    const icoPath = path.join(publicDir, 'favicon.ico');
    const png32Path = path.join(publicDir, 'favicon-32x32.png');
    fs.copyFileSync(png32Path, icoPath);
    console.log(`✓ Generated favicon.ico (32x32)`);

    console.log('\n✨ All favicons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run build');
    console.log('2. Commit and push to GitHub');
    console.log('3. Vercel will auto-deploy');
    console.log('4. Hard-refresh your domain (Ctrl+Shift+R) to see the new icon');
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();
