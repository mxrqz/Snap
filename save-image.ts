#!/usr/bin/env bun

import { existsSync, mkdirSync } from 'fs';
import { writeFileSync } from 'fs';
import { join } from 'path';

const API_BASE = process.env.SNAP_API_URL || 'http://localhost:3000';

interface SaveImageOptions {
  url: string;
  output?: string;
  borderRadius?: number;
  margin?: number;
  background?: 'solid' | 'gradient';
  backgroundColor?: string;
  browserMockup?: 'safari' | 'chrome' | 'firefox' | 'edge' | 'none';
}

async function saveImage(options: SaveImageOptions): Promise<string> {
  const params = new URLSearchParams();
  
  params.set('url', options.url);
  if (options.borderRadius !== undefined) params.set('borderRadius', options.borderRadius.toString());
  if (options.margin !== undefined) params.set('margin', options.margin.toString());
  if (options.browserMockup) params.set('browserMockup', options.browserMockup);
  if (options.background === 'solid' && options.backgroundColor) {
    params.set('background.type', 'solid');
    params.set('background.color', options.backgroundColor);
  }

  const apiUrl = `${API_BASE}/snap?${params.toString()}`;
  
  console.log(`🔄 Fetching screenshot from: ${options.url}`);
  
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || `API returned status ${response.status}`);
    }
    
    // Extract base64 data
    const base64Data = data.imageUrl.replace(/^data:image\/png;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Create output filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const domain = new URL(options.url).hostname.replace(/\./g, '-');
    const filename = options.output || `screenshot-${domain}-${timestamp}.png`;
    
    // Create output directory if it doesn't exist
    const outputDir = './screenshots';
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }
    
    const fullPath = join(outputDir, filename);
    
    // Save image
    writeFileSync(fullPath, imageBuffer);
    
    console.log(`✅ Screenshot saved: ${fullPath}`);
    console.log(`📏 Dimensions: ${data.metadata.dimensions.width}x${data.metadata.dimensions.height}`);
    console.log(`💾 Size: ${Math.round(imageBuffer.length / 1024)}KB`);
    
    return fullPath;
  } catch (error) {
    console.error('❌ Error saving screenshot:', error);
    throw error;
  }
}

// CLI Usage
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
📸 Snap Screenshot Saver

Usage:
  bun save-image.ts <URL> [options]

Options:
  --output <filename>         Output filename (default: auto-generated)
  --border-radius <number>    Border radius in pixels (0-50)
  --margin <number>           Margin in pixels (0-200)
  --background <color>        Background color (hex format)
  --browser <type>            Browser mockup (safari, chrome, firefox, edge, none)

Examples:
  bun save-image.ts https://example.com
  bun save-image.ts https://github.com --border-radius 15 --margin 40
  bun save-image.ts https://google.com --background "#ffffff" --browser safari
  bun save-image.ts https://example.com --output my-screenshot.png
    `);
    process.exit(0);
  }
  
  const url = args[0];
  const options: SaveImageOptions = { url };
  
  // Parse command line arguments
  for (let i = 1; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];
    
    switch (flag) {
      case '--output':
        options.output = value;
        break;
      case '--border-radius':
        options.borderRadius = parseInt(value);
        break;
      case '--margin':
        options.margin = parseInt(value);
        break;
      case '--background':
        options.background = 'solid';
        options.backgroundColor = value;
        break;
      case '--browser':
        options.browserMockup = value as any;
        break;
    }
  }
  
  try {
    await saveImage(options);
  } catch (error) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(() => process.exit(1));
}

export { saveImage, type SaveImageOptions };