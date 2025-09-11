import { useCallback, useRef } from 'react';

interface ScreenshotConfig {
  url: string;
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  delay: number;
  colorScheme: 'light' | 'dark';
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    deviceScaleFactor: number;
  };
}

interface StyleConfig {
  borderRadius: number;
  margin: number;
  background: {
    type: 'solid' | 'gradient' | 'pattern';
    color?: string;
    direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
    colors?: Array<{ color: string; position?: number }>;
    // Pattern properties
    pattern?: 'dots' | 'lines' | 'grid';
    patternSize?: number;
    patternColor?: string;
    patternOpacity?: number;
    patternBackgroundType?: 'solid' | 'gradient'; // Background base for patterns
    // Texture properties
    texture?: 'noise' | 'paper' | 'fabric' | 'none';
    textureIntensity?: number;
  };
  browserMockup: 'safari' | 'chrome' | 'firefox' | 'edge' | 'none';
  shadow: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
}

export function useImageProcessor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const processImage = useCallback(async (
    imageUrl: string,
    style: StyleConfig,
    originalUrl?: string
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context not available');

          // Calculate dimensions with margin
          const originalWidth = img.width;
          const originalHeight = img.height;
          const totalMargin = style.margin * 2;
          
          canvas.width = originalWidth + totalMargin;
          canvas.height = originalHeight + totalMargin;

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw background
          drawBackground(ctx, canvas.width, canvas.height, style.background);

          // Save context for image processing
          ctx.save();
          
          // Apply browser frame first if needed
          let imageX = style.margin;
          let imageY = style.margin;
          let imageWidth = originalWidth;
          let imageHeight = originalHeight;

          if (style.browserMockup !== 'none') {
            const frameResult = drawBrowserFrame(ctx, img, style.margin, style.margin, originalWidth, originalHeight, style.browserMockup, style.borderRadius, originalUrl);
            imageX = frameResult.imageX;
            imageY = frameResult.imageY;
            imageWidth = frameResult.imageWidth;
            imageHeight = frameResult.imageHeight;
          } else {
            // Apply border radius to image if needed (only when no browser frame)
            if (style.borderRadius > 0) {
              drawRoundedImage(
                ctx, 
                img, 
                style.margin, 
                style.margin, 
                originalWidth, 
                originalHeight, 
                style.borderRadius
              );
            } else {
              ctx.drawImage(img, style.margin, style.margin, originalWidth, originalHeight);
            }
          }

          // Apply shadow if enabled
          if (style.shadow.enabled) {
            applyShadowEffect(ctx, imageX, imageY, imageWidth, imageHeight, style.shadow);
          }

          ctx.restore();

          // Convert to base64
          const dataUrl = canvas.toDataURL('image/png');
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });
  }, []);

  const drawBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    background: StyleConfig['background']
  ) => {
    // Base background
    if (background.type === 'solid') {
      ctx.fillStyle = background.color || '#667eea';
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'gradient') {
      // Create gradient
      const gradient = createGradient(ctx, width, height, background.direction || 'to-br', background.colors || []);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    } else if (background.type === 'pattern') {
      // Base background for pattern (solid or gradient)
      if (background.patternBackgroundType === 'gradient') {
        const gradient = createGradient(ctx, width, height, background.direction || 'to-br', background.colors || []);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      } else {
        // Default to solid color
        ctx.fillStyle = background.color || '#667eea';
        ctx.fillRect(0, 0, width, height);
      }
      
      // Draw pattern overlay
      drawPattern(ctx, width, height, background);
    }

    // Apply texture overlay (for any background type)
    if (background.texture && background.texture !== 'none') {
      drawTexture(ctx, width, height, background);
    }
  };

  const createGradient = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    direction: string,
    colors: Array<{ color: string; position?: number }>
  ) => {
    let gradient: CanvasGradient;

    // Convert CSS direction to canvas coordinates
    switch (direction) {
      case 'to-r':
        gradient = ctx.createLinearGradient(0, 0, width, 0);
        break;
      case 'to-l':
        gradient = ctx.createLinearGradient(width, 0, 0, 0);
        break;
      case 'to-t':
        gradient = ctx.createLinearGradient(0, height, 0, 0);
        break;
      case 'to-b':
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        break;
      case 'to-br':
        gradient = ctx.createLinearGradient(0, 0, width, height);
        break;
      case 'to-bl':
        gradient = ctx.createLinearGradient(width, 0, 0, height);
        break;
      case 'to-tr':
        gradient = ctx.createLinearGradient(0, height, width, 0);
        break;
      case 'to-tl':
        gradient = ctx.createLinearGradient(width, height, 0, 0);
        break;
      default:
        gradient = ctx.createLinearGradient(0, 0, width, height);
    }

    colors.forEach(color => {
      gradient.addColorStop((color.position || 0) / 100, color.color);
    });

    return gradient;
  };

  const drawPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    background: StyleConfig['background']
  ) => {
    const patternSize = background.patternSize || 20;
    const patternColor = background.patternColor || '#ffffff';
    const patternOpacity = background.patternOpacity || 0.1;

    ctx.save();
    ctx.globalAlpha = patternOpacity;
    ctx.fillStyle = patternColor;
    ctx.strokeStyle = patternColor;

    switch (background.pattern) {
      case 'dots':
        drawDots(ctx, width, height, patternSize);
        break;
      case 'lines':
        drawLines(ctx, width, height, patternSize);
        break;
      case 'grid':
        drawGrid(ctx, width, height, patternSize);
        break;
    }

    ctx.restore();
  };

  const drawDots = (ctx: CanvasRenderingContext2D, width: number, height: number, size: number) => {
    const spacing = size * 2;
    const radius = size / 8;
    
    for (let x = spacing; x < width; x += spacing) {
      for (let y = spacing; y < height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  };

  const drawLines = (ctx: CanvasRenderingContext2D, width: number, height: number, size: number) => {
    const spacing = size;
    ctx.lineWidth = size / 10;

    // Vertical lines
    for (let x = spacing; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, size: number) => {
    const spacing = size;
    ctx.lineWidth = size / 15;

    // Vertical lines
    for (let x = spacing; x < width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = spacing; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawTexture = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    background: StyleConfig['background']
  ) => {
    const intensity = background.textureIntensity || 0.5;

    ctx.save();
    ctx.globalAlpha = intensity;

    switch (background.texture) {
      case 'noise':
        drawNoise(ctx, width, height);
        break;
      case 'paper':
        drawPaper(ctx, width, height);
        break;
      case 'fabric':
        drawFabric(ctx, width, height);
        break;
    }

    ctx.restore();
  };

  const drawNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // R
      data[i + 1] = noise; // G
      data[i + 2] = noise; // B
      data[i + 3] = 50;    // A (low alpha for subtle effect)
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const drawPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Paper texture with fibres and subtle variations
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    for (let i = 0; i < width * height / 100; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2 + 0.5;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add some random lines for paper fibres
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.1)';
    ctx.lineWidth = 0.5;
    
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }
  };

  const drawFabric = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Fabric texture with cross-hatch pattern
    const spacing = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 0.5;

    // Horizontal threads
    for (let y = 0; y < height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical threads
    for (let x = 0; x < width; x += spacing * 2) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  };

  const drawRoundedImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.save();
    
    // Create clipping path with rounded corners (compatible version)
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.clip();
    
    // Draw image
    ctx.drawImage(img, x, y, width, height);
    
    ctx.restore();
  };

  const applyShadowEffect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    shadow: StyleConfig['shadow']
  ) => {
    ctx.save();
    
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX;
    ctx.shadowOffsetY = shadow.offsetY;
    ctx.globalAlpha = shadow.opacity;
    
    // Draw a rectangle to create shadow
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(x, y, width, height);
    
    ctx.restore();
  };

  const drawBrowserFrame = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    browserType: StyleConfig['browserMockup'],
    borderRadius: number = 0,
    url: string = ''
  ) => {
    const frameHeight = 45; // Simplified single bar height
    const frameWidth = width;
    const totalFrameHeight = height + frameHeight;
    
    // Draw browser frame background and UI
    if (borderRadius > 0) {
      // Create clipping path for the entire frame including image
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + frameWidth - borderRadius, y);
      ctx.quadraticCurveTo(x + frameWidth, y, x + frameWidth, y + borderRadius);
      ctx.lineTo(x + frameWidth, y + totalFrameHeight - borderRadius);
      ctx.quadraticCurveTo(x + frameWidth, y + totalFrameHeight, x + frameWidth - borderRadius, y + totalFrameHeight);
      ctx.lineTo(x + borderRadius, y + totalFrameHeight);
      ctx.quadraticCurveTo(x, y + totalFrameHeight, x, y + totalFrameHeight - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();
      ctx.clip();
    }
    
    // Draw browser-specific UI
    drawBrowserUI(ctx, x, y, frameWidth, frameHeight, browserType, url);
    
    // Draw image
    ctx.drawImage(img, x, y + frameHeight, width, height);
    
    if (borderRadius > 0) {
      ctx.restore();
    }
    
    return {
      imageX: x,
      imageY: y,
      imageWidth: frameWidth,
      imageHeight: totalFrameHeight
    };
  };

  const drawBrowserUI = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    browserType: StyleConfig['browserMockup'],
    url: string = ''
  ) => {
    // Get browser-specific colors
    const colors = getBrowserColors(browserType);
    
    // Draw background
    ctx.fillStyle = colors.background;
    ctx.fillRect(x, y, width, height);
    
    // Draw traffic light controls (left side)
    const controlY = y + height / 2;
    const controlRadius = 6;
    
    ctx.fillStyle = '#ff5f56';
    ctx.beginPath();
    ctx.arc(x + 20, controlY, controlRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.arc(x + 40, controlY, controlRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#27ca3f';
    ctx.beginPath();
    ctx.arc(x + 60, controlY, controlRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw address bar with high border radius
    const addressBarX = x + 90;
    const addressBarY = y + 12;
    const addressBarWidth = width - 140;
    const addressBarHeight = 21;
    const addressBarRadius = 12;
    
    // Address bar background
    ctx.fillStyle = colors.addressBar;
    ctx.beginPath();
    ctx.moveTo(addressBarX + addressBarRadius, addressBarY);
    ctx.lineTo(addressBarX + addressBarWidth - addressBarRadius, addressBarY);
    ctx.quadraticCurveTo(addressBarX + addressBarWidth, addressBarY, addressBarX + addressBarWidth, addressBarY + addressBarRadius);
    ctx.lineTo(addressBarX + addressBarWidth, addressBarY + addressBarHeight - addressBarRadius);
    ctx.quadraticCurveTo(addressBarX + addressBarWidth, addressBarY + addressBarHeight, addressBarX + addressBarWidth - addressBarRadius, addressBarY + addressBarHeight);
    ctx.lineTo(addressBarX + addressBarRadius, addressBarY + addressBarHeight);
    ctx.quadraticCurveTo(addressBarX, addressBarY + addressBarHeight, addressBarX, addressBarY + addressBarHeight - addressBarRadius);
    ctx.lineTo(addressBarX, addressBarY + addressBarRadius);
    ctx.quadraticCurveTo(addressBarX, addressBarY, addressBarX + addressBarRadius, addressBarY);
    ctx.closePath();
    ctx.fill();
    
    // Format and display URL
    const displayUrl = formatUrl(url);
    ctx.fillStyle = colors.text;
    ctx.font = '11px -apple-system, system-ui, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`🔒 ${displayUrl}`, addressBarX + 10, addressBarY + 14);
  };

  const getBrowserColors = (browserType: StyleConfig['browserMockup']) => {
    switch (browserType) {
      case 'safari':
        return {
          background: '#f6f6f6', // Branco/cinza claro do Safari
          addressBar: '#ffffff',
          text: '#1d1d1f'
        };
      case 'chrome':
        return {
          background: '#e8eaed', // Cinza do Chrome
          addressBar: '#ffffff',
          text: '#202124'
        };
      case 'firefox':
        return {
          background: '#4c1d95', // Roxo escuro do Firefox
          addressBar: '#6b46c1',
          text: '#f8fafc'
        };
      case 'edge':
        return {
          background: '#0078d4', // Azul do Edge
          addressBar: '#106ebe',
          text: '#ffffff'
        };
      default:
        return {
          background: '#f0f0f0',
          addressBar: '#ffffff',
          text: '#333333'
        };
    }
  };

  const formatUrl = (url: string): string => {
    if (!url) return 'website.com';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0] || 'website.com';
    }
  };


  // Function to fetch screenshot from Microlink directly
  const fetchScreenshot = useCallback(async (config: ScreenshotConfig): Promise<string> => {
    const response = await fetch('/api/microlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: config.url,
        screenshot: config
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch screenshot');
    }

    const data = await response.json();
    return data.imageUrl;
  }, []);

  return {
    processImage,
    fetchScreenshot
  };
}