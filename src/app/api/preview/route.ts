import { NextRequest, NextResponse } from 'next/server'
import { MicrolinkService } from '@/lib/services/microlink'
import { ImageProcessor } from '@/lib/services/image-processor'
import { BrowserMockupService } from '@/lib/services/browser-mockup'
import { validateSnapQuery, queryToRequest } from '@/lib/validation'
import type { ScreenshotConfig, StyleConfig } from '@/lib/types'

async function processSnapshot(url: string, screenshotConfig?: Partial<ScreenshotConfig>, styleConfig?: Partial<StyleConfig>): Promise<{ buffer: Buffer, metadata: any }> {
  const finalScreenshotConfig: ScreenshotConfig = {
    ...MicrolinkService.getDefaultConfig(),
    url,
    ...screenshotConfig
  }

  const finalStyleConfig: StyleConfig = {
    ...ImageProcessor.getDefaultStyle(),
    ...styleConfig
  }

  const screenshotBuffer = await MicrolinkService.fetchScreenshot(finalScreenshotConfig)
  
  let processedBuffer = screenshotBuffer
  if (finalStyleConfig.browserMockup !== 'none') {
    processedBuffer = await BrowserMockupService.applyMockup(processedBuffer, finalStyleConfig.browserMockup)
  }
  
  processedBuffer = await ImageProcessor.processScreenshot(processedBuffer, finalStyleConfig)
  
  const sharp = (await import('sharp')).default
  const metadata = await sharp(processedBuffer).metadata()
  
  return {
    buffer: processedBuffer,
    metadata: {
      width: metadata.width || 0,
      height: metadata.height || 0
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    if (!queryParams.url) {
      const html = `
        <html>
          <head><title>Snap Preview</title></head>
          <body style="font-family: Arial; padding: 40px; text-align: center;">
            <h1>🖼️ Snap Preview</h1>
            <p>Add <code>?url=https://example.com</code> to preview a screenshot</p>
            <p>Example: <a href="/api/preview?url=https://example.com&borderRadius=15&margin=40">/api/preview?url=https://example.com&borderRadius=15&margin=40</a></p>
          </body>
        </html>
      `
      
      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    const cleanedParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== '')
    )

    const validatedQuery = validateSnapQuery(cleanedParams)
    const snapRequest = queryToRequest(validatedQuery)
    
    const { buffer, metadata } = await processSnapshot(
      snapRequest.url,
      snapRequest.screenshot,
      snapRequest.style
    )
    
    const base64Image = buffer.toString('base64')
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Snap Preview: ${snapRequest.url}</title>
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
              <strong>URL:</strong> ${snapRequest.url}
            </div>
            
            <div class="image-container">
              <img src="data:image/png;base64,${base64Image}" alt="Screenshot of ${snapRequest.url}" />
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
    `
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    })
  } catch (error) {
    console.error('Preview error:', error)
    
    const errorHtml = `
      <html>
        <head><title>Preview Error</title></head>
        <body style="font-family: Arial; padding: 40px; color: #d32f2f;">
          <h1>❌ Preview Error</h1>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p><a href="/api/preview">← Back to Preview</a></p>
        </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' }
    })
  }
}