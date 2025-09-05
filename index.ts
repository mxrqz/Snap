import { MicrolinkService } from './services/microlink.js';
import { ImageProcessor } from './services/image-processor.js';
import { BrowserMockupService } from './services/browser-mockup.js';
import { validateSnapRequest, validateSnapQuery, queryToRequest } from './validation.js';
import type { SnapResponse, ScreenshotConfig, StyleConfig } from './types.js';
import { readFileSync } from 'fs';
import { join } from 'path';

const PORT = process.env.PORT || 3000;

function createErrorResponse(error: string, status = 400): Response {
  const response: SnapResponse = {
    success: false,
    error
  };
  
  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function createSuccessResponse(imageBuffer: Buffer, url: string, metadata: any): Response {
  const response: SnapResponse = {
    success: true,
    imageUrl: `data:image/png;base64,${imageBuffer.toString('base64')}`,
    metadata: {
      originalUrl: url,
      processedAt: new Date().toISOString(),
      dimensions: metadata
    }
  };

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function processSnapshot(url: string, screenshotConfig?: Partial<ScreenshotConfig>, styleConfig?: Partial<StyleConfig>): Promise<{ buffer: Buffer, metadata: any }> {
  // Merge with defaults
  const finalScreenshotConfig: ScreenshotConfig = {
    ...MicrolinkService.getDefaultConfig(),
    url,
    ...screenshotConfig
  };

  const finalStyleConfig: StyleConfig = {
    ...ImageProcessor.getDefaultStyle(),
    ...styleConfig
  };

  // Fetch screenshot from Microlink
  const screenshotBuffer = await MicrolinkService.fetchScreenshot(finalScreenshotConfig);
  
  // Apply browser mockup if specified
  let processedBuffer = screenshotBuffer;
  if (finalStyleConfig.browserMockup !== 'none') {
    processedBuffer = await BrowserMockupService.applyMockup(processedBuffer, finalStyleConfig.browserMockup);
  }
  
  // Apply styling (borders, margins, gradients, shadows)
  processedBuffer = await ImageProcessor.processScreenshot(processedBuffer, finalStyleConfig);
  
  // Get final dimensions
  const sharp = (await import('sharp')).default;
  const metadata = await sharp(processedBuffer).metadata();
  
  return {
    buffer: processedBuffer,
    metadata: {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  };
}

const server = Bun.serve({
  port: PORT,
  
  routes: {
    "/": {
      GET: () => new Response(JSON.stringify({
        name: "Snap API",
        version: "1.0.0",
        description: "Screenshot styling API powered by Microlink",
        endpoints: {
          "GET /snap": "Generate styled screenshot via query parameters",
          "POST /snap": "Generate styled screenshot via JSON body",
          "GET /preview": "Preview screenshot in browser",
          "GET /docs": "API documentation (Swagger UI)",
          "GET /health": "Health check endpoint"
        }
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    },

    "/health": {
      GET: () => new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
        headers: { 'Content-Type': 'application/json' }
      })
    },

    "/favicon.ico": {
      GET: () => new Response(null, { status: 404 })
    },

    "/docs": {
      GET: () => {
        try {
          const swaggerHtml = `
            <!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Snap API Documentation</title>
                <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
                <style>
                  html {
                    box-sizing: border-box;
                    overflow: -moz-scrollbars-vertical;
                    overflow-y: scroll;
                  }
                  *, *:before, *:after {
                    box-sizing: inherit;
                  }
                  body {
                    margin:0;
                    background: #fafafa;
                  }
                </style>
              </head>
              <body>
                <div id="swagger-ui"></div>
                <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
                <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
                <script>
                  window.onload = function() {
                    SwaggerUIBundle({
                      url: '/openapi.json',
                      dom_id: '#swagger-ui',
                      deepLinking: true,
                      presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIStandalonePreset
                      ],
                      plugins: [
                        SwaggerUIBundle.plugins.DownloadUrl
                      ],
                      layout: "StandaloneLayout"
                    });
                  };
                </script>
              </body>
            </html>
          `;
          
          return new Response(swaggerHtml, {
            headers: { 'Content-Type': 'text/html' }
          });
        } catch (error) {
          return new Response('Documentation unavailable', { status: 500 });
        }
      }
    },

    "/openapi.json": {
      GET: () => {
        try {
          const openApiSpec = readFileSync(join(process.cwd(), 'openapi.json'), 'utf8');
          return new Response(openApiSpec, {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response('OpenAPI spec not found', { status: 404 });
        }
      }
    },

    "/preview": {
      GET: async (req) => {
        try {
          const url = new URL(req.url);
          const queryParams = Object.fromEntries(url.searchParams.entries());
          
          if (!queryParams.url) {
            return new Response(`
              <html>
                <head><title>Snap Preview</title></head>
                <body style="font-family: Arial; padding: 40px; text-align: center;">
                  <h1>🖼️ Snap Preview</h1>
                  <p>Add <code>?url=https://example.com</code> to preview a screenshot</p>
                  <p>Example: <a href="/preview?url=https://example.com&borderRadius=15&margin=40">/preview?url=https://example.com&borderRadius=15&margin=40</a></p>
                </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          }

          // Clean up empty parameters
          const cleanedParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== '')
          );

          const validatedQuery = validateSnapQuery(cleanedParams);
          const request = queryToRequest(validatedQuery);
          
          const { buffer, metadata } = await processSnapshot(
            request.url,
            request.screenshot,
            request.style
          );
          
          const base64Image = buffer.toString('base64');
          
          return new Response(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Snap Preview: ${request.url}</title>
                <meta charset="utf-8">
                <style>
                  body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0; 
                    padding: 20px; 
                    background: #f5f5f5;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  }
                  .container { 
                    max-width: 1200px; 
                    background: white; 
                    border-radius: 12px; 
                    padding: 30px; 
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                  }
                  .image-container { 
                    text-align: center; 
                    margin: 20px 0; 
                  }
                  .image-container img { 
                    max-width: 100%; 
                    height: auto; 
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                  }
                  .metadata {
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-size: 14px;
                  }
                  .metadata strong { color: #495057; }
                  .url-info {
                    background: #e3f2fd;
                    padding: 10px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    word-break: break-all;
                  }
                  .download-btn {
                    background: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-block;
                    margin: 10px 5px;
                  }
                  .download-btn:hover { background: #0056b3; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>📸 Screenshot Preview</h1>
                  <div class="url-info">
                    <strong>URL:</strong> ${request.url}
                  </div>
                  
                  <div class="image-container">
                    <img src="data:image/png;base64,${base64Image}" alt="Screenshot of ${request.url}" />
                  </div>
                  
                  <div style="text-align: center;">
                    <a href="data:image/png;base64,${base64Image}" download="screenshot-${Date.now()}.png" class="download-btn">
                      💾 Download PNG
                    </a>
                    <button onclick="copyToClipboard()" class="download-btn" style="background: #28a745;">
                      📋 Copy Base64
                    </button>
                  </div>
                  
                  <div class="metadata">
                    <strong>Dimensions:</strong> ${metadata.width} × ${metadata.height}px<br>
                    <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
                    <strong>File Size:</strong> ~${Math.round(buffer.length / 1024)}KB
                  </div>
                </div>
                
                <script>
                  function copyToClipboard() {
                    const base64 = "data:image/png;base64,${base64Image}";
                    navigator.clipboard.writeText(base64).then(() => {
                      alert('Base64 image data copied to clipboard!');
                    });
                  }
                </script>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        } catch (error) {
          console.error('Preview error:', error);
          
          return new Response(`
            <html>
              <head><title>Preview Error</title></head>
              <body style="font-family: Arial; padding: 40px; color: #d32f2f;">
                <h1>❌ Preview Error</h1>
                <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
                <p><a href="/preview">← Back to Preview</a></p>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }
    },

    "/snap": {
      GET: async (req) => {
        try {
          const url = new URL(req.url);
          const queryParams = Object.fromEntries(url.searchParams.entries());
          console.log('Query params received:', queryParams);
          
          if (!queryParams.url) {
            return createErrorResponse("Missing required parameter: url");
          }

          // Clean up empty string parameters
          const cleanedParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== '')
          );

          const validatedQuery = validateSnapQuery(cleanedParams);
          const request = queryToRequest(validatedQuery);
          
          const { buffer, metadata } = await processSnapshot(
            request.url,
            request.screenshot,
            request.style
          );
          
          return createSuccessResponse(buffer, request.url, metadata);
        } catch (error) {
          console.error('GET /snap error:', error);
          
          if (error instanceof Error) {
            if (error.message.includes('ZodError') || error.name === 'ZodError') {
              return createErrorResponse(`Validation error: ${error.message}`, 400);
            }
            if (error.message.includes('Screenshot fetch failed')) {
              return createErrorResponse(`Screenshot error: ${error.message}`, 503);
            }
            if (error.message.includes('Processing error') || error.message.includes('Sharp')) {
              return createErrorResponse(`Image processing error: ${error.message}`, 500);
            }
            return createErrorResponse(`Server error: ${error.message}`, 500);
          }
          
          return createErrorResponse('Internal server error', 500);
        }
      },

      POST: async (req) => {
        try {
          const body = await req.json();
          const validatedRequest = validateSnapRequest(body);
          
          const { buffer, metadata } = await processSnapshot(
            validatedRequest.url,
            validatedRequest.screenshot,
            validatedRequest.style
          );
          
          return createSuccessResponse(buffer, validatedRequest.url, metadata);
        } catch (error) {
          console.error('POST /snap error:', error);
          
          if (error instanceof Error) {
            if (error.message.includes('validation')) {
              return createErrorResponse(`Validation error: ${error.message}`, 400);
            }
            if (error.message.includes('Microlink') || error.message.includes('fetch')) {
              return createErrorResponse(`Screenshot error: ${error.message}`, 503);
            }
            return createErrorResponse(`Processing error: ${error.message}`, 500);
          }
          
          return createErrorResponse('Internal server error', 500);
        }
      }
    }
  },

  development: {
    hmr: true,
    console: true
  }
});

console.log(`🚀 Snap API server running at http://localhost:${PORT}`);
console.log(`📖 API documentation available at http://localhost:${PORT}`);

export default server;