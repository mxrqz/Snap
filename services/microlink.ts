import type { ScreenshotConfig, MicrolinkResponse } from '../types.js';

const MICROLINK_API_BASE = 'https://api.microlink.io';

export class MicrolinkService {
  static getScreenshotUrl(config: ScreenshotConfig): string {
    const params = new URLSearchParams({
      url: config.url,
      screenshot: 'true',
      waitUntil: config.waitUntil,
      meta: 'false',
      embed: 'screenshot.url',
      colorScheme: config.colorScheme,
      'viewport.isMobile': config.viewport.isMobile.toString(),
      'viewport.deviceScaleFactor': config.viewport.deviceScaleFactor.toString(),
      'viewport.width': config.viewport.width.toString(),
      'viewport.height': config.viewport.height.toString(),
      delay: config.delay.toString(),
    });

    return `${MICROLINK_API_BASE}?${params.toString()}`;
  }

  static async fetchScreenshot(config: ScreenshotConfig): Promise<Buffer> {
    const apiUrl = this.getScreenshotUrl(config);
    
    try {
      console.log(`Fetching screenshot from: ${apiUrl}`);
      const response = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'Snap-API/1.0.0'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Microlink API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      console.log(`Response content-type: ${contentType}`);

      // Handle direct image response (when embed=screenshot.url returns the image directly)
      if (contentType && contentType.startsWith('image/')) {
        console.log('Received direct image response from Microlink');
        const imageBuffer = await response.arrayBuffer();
        
        if (imageBuffer.byteLength === 0) {
          throw new Error('Received empty image buffer');
        }

        return Buffer.from(imageBuffer);
      }

      // Handle JSON response (traditional API response with screenshot URL)
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Unexpected content-type: ${contentType}. Expected JSON or image.`);
      }

      let data: MicrolinkResponse;
      try {
        data = await response.json();
      } catch (parseError) {
        const responseText = await response.text().catch(() => 'Unable to read response');
        throw new Error(`Failed to parse JSON response: ${responseText.slice(0, 200)}...`);
      }
      
      if (data.status !== 'success') {
        throw new Error(`Microlink API returned error status: ${data.status}`);
      }
      
      if (!data.data?.screenshot?.url) {
        throw new Error(`Screenshot URL not found in response: ${JSON.stringify(data).slice(0, 200)}`);
      }

      console.log(`Downloading image from: ${data.data.screenshot.url}`);
      const imageResponse = await fetch(data.data.screenshot.url);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch screenshot image: ${imageResponse.status} ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      if (imageBuffer.byteLength === 0) {
        throw new Error('Received empty image buffer');
      }

      return Buffer.from(imageBuffer);
    } catch (error) {
      if (error instanceof Error) {
        // Re-throw with more context
        throw new Error(`Screenshot fetch failed: ${error.message}`);
      }
      throw new Error('Screenshot fetch failed: Unknown error');
    }
  }

  static getDefaultConfig(): ScreenshotConfig {
    return {
      url: '',
      waitUntil: 'networkidle0',
      delay: 2000,
      colorScheme: 'dark',
      viewport: {
        width: 1920,
        height: 1080,
        isMobile: false,
        deviceScaleFactor: 1,
      }
    };
  }
}