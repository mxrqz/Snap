import sharp from 'sharp';
import type { BrowserMockup } from '../types.js';

export class BrowserMockupService {
  private static readonly MOCKUP_CONFIGS = {
    safari: {
      topBarHeight: 80,
      borderRadius: 12,
      backgroundColor: '#f6f6f6',
      controlsColor: '#ff5f56,#ffbd2e,#27ca3f',
      addressBarColor: '#ffffff',
      addressBarHeight: 36,
      titleBarHeight: 44
    },
    chrome: {
      topBarHeight: 80,
      borderRadius: 8,
      backgroundColor: '#f1f3f4',
      controlsColor: '#ff5f56,#ffbd2e,#27ca3f',
      addressBarColor: '#ffffff',
      addressBarHeight: 36,
      titleBarHeight: 44
    },
    firefox: {
      topBarHeight: 80,
      borderRadius: 8,
      backgroundColor: '#f9f9fa',
      controlsColor: '#ff5f56,#ffbd2e,#27ca3f',
      addressBarColor: '#ffffff',
      addressBarHeight: 32,
      titleBarHeight: 48
    },
    edge: {
      topBarHeight: 80,
      borderRadius: 8,
      backgroundColor: '#e5e5e5',
      controlsColor: '#ff5f56,#ffbd2e,#27ca3f',
      addressBarColor: '#ffffff',
      addressBarHeight: 34,
      titleBarHeight: 46
    }
  };

  static async applyMockup(imageBuffer: Buffer, mockup: BrowserMockup): Promise<Buffer> {
    if (mockup === 'none') {
      return imageBuffer;
    }

    const config = this.MOCKUP_CONFIGS[mockup];
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions for mockup');
    }

    const mockupWidth = metadata.width + 20; // 10px padding on each side
    const mockupHeight = metadata.height + config.topBarHeight + 20; // top bar + bottom padding

    const mockupSvg = this.generateMockupSvg(mockupWidth, mockupHeight, config, mockup);
    const mockupBuffer = Buffer.from(mockupSvg);

    return sharp(mockupBuffer)
      .composite([
        {
          input: imageBuffer,
          left: 10,
          top: config.topBarHeight + 10
        }
      ])
      .png()
      .toBuffer();
  }

  private static generateMockupSvg(
    width: number,
    height: number,
    config: typeof BrowserMockupService.MOCKUP_CONFIGS.safari,
    browser: Exclude<BrowserMockup, 'none'>
  ): string {
    const controls = config.controlsColor.split(',');
    
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${config.backgroundColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e0e0e0;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Main container with rounded corners -->
        <rect width="${width}" height="${height}" rx="${config.borderRadius}" ry="${config.borderRadius}" 
              fill="${config.backgroundColor}" stroke="#d0d0d0" stroke-width="1"/>
        
        <!-- Top bar -->
        <rect x="1" y="1" width="${width - 2}" height="${config.titleBarHeight}" 
              rx="${config.borderRadius}" ry="${config.borderRadius}" fill="url(#topBarGradient)"/>
        
        <!-- Traffic lights -->
        <circle cx="20" cy="${config.titleBarHeight / 2}" r="6" fill="${controls[0]}"/>
        <circle cx="40" cy="${config.titleBarHeight / 2}" r="6" fill="${controls[1]}"/>
        <circle cx="60" cy="${config.titleBarHeight / 2}" r="6" fill="${controls[2]}"/>
        
        <!-- Address bar -->
        <rect x="90" y="${(config.titleBarHeight - config.addressBarHeight) / 2}" 
              width="${width - 120}" height="${config.addressBarHeight}" 
              rx="16" ry="16" fill="${config.addressBarColor}" stroke="#d0d0d0" stroke-width="1"/>
        
        <!-- Address bar icon -->
        <circle cx="105" cy="${config.titleBarHeight / 2}" r="8" fill="#00c851" opacity="0.7"/>
        
        <!-- Separator line -->
        <line x1="10" y1="${config.titleBarHeight}" x2="${width - 10}" y2="${config.titleBarHeight}" 
              stroke="#d0d0d0" stroke-width="1"/>
      </svg>
    `;
  }
}