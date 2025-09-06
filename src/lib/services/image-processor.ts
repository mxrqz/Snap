import sharp from 'sharp';
import type { StyleConfig, BackgroundStyle, GradientDirection, FinalImageSize } from '../types.js';

export class ImageProcessor {
  private static readonly GRADIENT_ANGLES: Record<GradientDirection, number> = {
    'to-r': 90,
    'to-l': 270,
    'to-t': 0,
    'to-b': 180,
    'to-br': 135,
    'to-bl': 225,
    'to-tr': 45,
    'to-tl': 315,
  };

  static async processScreenshot(imageBuffer: Buffer, style: StyleConfig): Promise<Buffer> {
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    
    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image metadata');
    }

    let processed = image;

    if (style.borderRadius > 0) {
      processed = await this.applyBorderRadius(processed, style.borderRadius, metadata.width, metadata.height);
    }

    if (style.margin > 0 || style.background.type !== 'solid' || style.background.color !== 'transparent') {
      processed = await this.applyBackgroundAndMargin(
        processed,
        style.background,
        style.margin,
        metadata.width,
        metadata.height
      );
    }

    // Apply final size as the very last step to avoid dimension conflicts
    // TODO: Temporarily disabled due to compositing issues
    // if (style.finalSize) {
    //   processed = await this.applyFinalSize(processed, style.finalSize);
    // }

    return processed.png().toBuffer();
  }

  private static async applyBorderRadius(
    image: sharp.Sharp,
    radius: number,
    width: number,
    height: number
  ): Promise<sharp.Sharp> {
    // Get current image dimensions in case they've changed
    const metadata = await image.metadata();
    const currentWidth = metadata.width || width;
    const currentHeight = metadata.height || height;

    const mask = Buffer.from(
      `<svg width="${currentWidth}" height="${currentHeight}">
        <rect x="0" y="0" width="${currentWidth}" height="${currentHeight}" rx="${radius}" ry="${radius}" fill="white"/>
      </svg>`
    );

    return image.composite([
      {
        input: mask,
        blend: 'dest-in'
      }
    ]);
  }

  private static async applyBackgroundAndMargin(
    image: sharp.Sharp,
    background: BackgroundStyle,
    margin: number,
    originalWidth: number,
    originalHeight: number
  ): Promise<sharp.Sharp> {
    // Get current image dimensions in case they've changed
    const metadata = await image.metadata();
    const currentWidth = metadata.width || originalWidth;
    const currentHeight = metadata.height || originalHeight;

    const newWidth = currentWidth + (margin * 2);
    const newHeight = currentHeight + (margin * 2);

    let backgroundBuffer: Buffer;

    if (background.type === 'solid') {
      backgroundBuffer = await this.createSolidBackground(newWidth, newHeight, background.color);
    } else {
      backgroundBuffer = await this.createGradientBackground(newWidth, newHeight, background);
    }

    return sharp(backgroundBuffer).composite([
      {
        input: await image.toBuffer(),
        left: margin,
        top: margin,
        blend: 'over'
      }
    ]);
  }

  private static async createSolidBackground(width: number, height: number, color: string): Promise<Buffer> {
    return sharp({
      create: {
        width,
        height,
        channels: 4,
        background: color
      }
    }).png().toBuffer();
  }

  private static async createGradientBackground(
    width: number,
    height: number,
    gradient: Extract<BackgroundStyle, { type: 'gradient' }>
  ): Promise<Buffer> {
    const angle = this.GRADIENT_ANGLES[gradient.direction];
    const stops = gradient.colors
      .map(({ color, position = 50 }) => `<stop offset="${position}%" stop-color="${color}"/>`)
      .join('');

    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(${angle} 0.5 0.5)">
            ${stops}
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
      </svg>
    `;

    return Buffer.from(svg);
  }

  private static async applyShadow(
    image: sharp.Sharp,
    shadow: StyleConfig['shadow']
  ): Promise<sharp.Sharp> {
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Cannot apply shadow to image without dimensions');
    }

    const shadowWidth = metadata.width + Math.abs(shadow.offsetX) + (shadow.blur * 2);
    const shadowHeight = metadata.height + Math.abs(shadow.offsetY) + (shadow.blur * 2);

    const shadowSvg = `
      <svg width="${shadowWidth}" height="${shadowHeight}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="${shadow.blur}"/>
            <feOffset dx="${shadow.offsetX}" dy="${shadow.offsetY}" result="offset"/>
            <feFlood flood-color="${shadow.color}" flood-opacity="${shadow.opacity}"/>
            <feComposite in="SourceGraphic" operator="over"/>
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="transparent"/>
      </svg>
    `;

    const shadowBuffer = Buffer.from(shadowSvg);
    const baseX = Math.max(0, -shadow.offsetX) + shadow.blur;
    const baseY = Math.max(0, -shadow.offsetY) + shadow.blur;

    return sharp({
      create: {
        width: shadowWidth,
        height: shadowHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).composite([
      {
        input: shadowBuffer,
        blend: 'multiply'
      },
      {
        input: await image.toBuffer(),
        left: baseX,
        top: baseY,
        blend: 'over'
      }
    ]);
  }

  private static async applyFinalSize(
    image: sharp.Sharp,
    finalSize: FinalImageSize
  ): Promise<sharp.Sharp> {
    const metadata = await image.metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Cannot apply final size to image without dimensions');
    }

    let targetWidth: number | undefined = finalSize.width;
    let targetHeight: number | undefined = finalSize.height;

    if (finalSize.aspectRatio) {
      const [ratioW, ratioH] = finalSize.aspectRatio.split(':').map(Number);
      const ratio = ratioW / ratioH;

      if (finalSize.width && !finalSize.height) {
        targetHeight = Math.round(finalSize.width / ratio);
      } else if (finalSize.height && !finalSize.width) {
        targetWidth = Math.round(finalSize.height * ratio);
      } else if (!finalSize.width && !finalSize.height) {
        const currentRatio = metadata.width / metadata.height;
        if (ratio > currentRatio) {
          targetWidth = metadata.width;
          targetHeight = Math.round(metadata.width / ratio);
        } else {
          targetHeight = metadata.height;
          targetWidth = Math.round(metadata.height * ratio);
        }
      }
    }

    if (!targetWidth && !targetHeight) {
      return image;
    }

    let resizeOptions: sharp.ResizeOptions = {
      fit: finalSize.maintainAspectRatio !== false ? 'inside' : 'fill',
      withoutEnlargement: false
    };

    if (targetWidth && targetHeight) {
      return image.resize(targetWidth, targetHeight, resizeOptions);
    } else if (targetWidth) {
      return image.resize(targetWidth, undefined, resizeOptions);
    } else if (targetHeight) {
      return image.resize(undefined, targetHeight, resizeOptions);
    }

    return image;
  }

  static getDefaultStyle(): StyleConfig {
    return {
      borderRadius: 8,
      margin: 32,
      background: {
        type: 'gradient',
        direction: 'to-br',
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ]
      },
      browserMockup: 'none',
      shadow: {
        enabled: false,
        blur: 8,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.08
      }
    };
  }
}