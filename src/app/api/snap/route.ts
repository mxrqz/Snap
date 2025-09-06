import { NextRequest, NextResponse } from 'next/server'
import { MicrolinkService } from '@/lib/services/microlink'
import { ImageProcessor } from '@/lib/services/image-processor'
import { BrowserMockupService } from '@/lib/services/browser-mockup'
import { validateSnapRequest, validateSnapQuery, queryToRequest } from '@/lib/validation'
import type { SnapResponse, ScreenshotConfig, StyleConfig } from '@/lib/types'

function createErrorResponse(error: string, status = 400): NextResponse {
  const response: SnapResponse = {
    success: false,
    error
  }
  
  return NextResponse.json(response, { status })
}

function createSuccessResponse(imageBuffer: Buffer, url: string, metadata: any): NextResponse {
  const response: SnapResponse = {
    success: true,
    imageUrl: `data:image/png;base64,${imageBuffer.toString('base64')}`,
    metadata: {
      originalUrl: url,
      processedAt: new Date().toISOString(),
      dimensions: metadata
    }
  }

  return NextResponse.json(response)
}

async function processSnapshot(url: string, screenshotConfig?: Partial<ScreenshotConfig>, styleConfig?: Partial<StyleConfig>): Promise<{ buffer: Buffer, metadata: any }> {
  // Merge with defaults
  const finalScreenshotConfig: ScreenshotConfig = {
    ...MicrolinkService.getDefaultConfig(),
    url,
    ...screenshotConfig
  }

  const finalStyleConfig: StyleConfig = {
    ...ImageProcessor.getDefaultStyle(),
    ...styleConfig
  }

  // Optimize viewport for final image size if specified
  // TODO: Temporarily disabled - using original config
  // const optimizedScreenshotConfig = MicrolinkService.optimizeViewportForFinalSize(
  //   finalScreenshotConfig,
  //   finalStyleConfig.finalSize
  // )
  const optimizedScreenshotConfig = finalScreenshotConfig

  // Fetch screenshot from Microlink
  const screenshotBuffer = await MicrolinkService.fetchScreenshot(optimizedScreenshotConfig)
  
  // Apply browser mockup if specified
  let processedBuffer = screenshotBuffer
  if (finalStyleConfig.browserMockup !== 'none') {
    processedBuffer = await BrowserMockupService.applyMockup(processedBuffer, finalStyleConfig.browserMockup)
  }
  
  // Apply styling (borders, margins, gradients, shadows)
  processedBuffer = await ImageProcessor.processScreenshot(processedBuffer, finalStyleConfig)
  
  // Get final dimensions
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
    console.log('Query params received:', queryParams)
    
    if (!queryParams.url) {
      return createErrorResponse("Missing required parameter: url")
    }

    // Clean up empty string parameters
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
    
    return createSuccessResponse(buffer, snapRequest.url, metadata)
  } catch (error) {
    console.error('GET /api/snap error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('ZodError') || error.name === 'ZodError') {
        return createErrorResponse(`Validation error: ${error.message}`, 400)
      }
      if (error.message.includes('Screenshot fetch failed')) {
        return createErrorResponse(`Screenshot error: ${error.message}`, 503)
      }
      if (error.message.includes('Processing error') || error.message.includes('Sharp')) {
        return createErrorResponse(`Image processing error: ${error.message}`, 500)
      }
      return createErrorResponse(`Server error: ${error.message}`, 500)
    }
    
    return createErrorResponse('Internal server error', 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedRequest = validateSnapRequest(body)
    
    const { buffer, metadata } = await processSnapshot(
      validatedRequest.url,
      validatedRequest.screenshot,
      validatedRequest.style
    )
    
    return createSuccessResponse(buffer, validatedRequest.url, metadata)
  } catch (error) {
    console.error('POST /api/snap error:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('ZodError') || error.name === 'ZodError') {
        return createErrorResponse(`Validation error: ${error.message}`, 400)
      }
      if (error.message.includes('Screenshot fetch failed')) {
        return createErrorResponse(`Screenshot error: ${error.message}`, 503)
      }
      if (error.message.includes('Processing error') || error.message.includes('Sharp')) {
        return createErrorResponse(`Image processing error: ${error.message}`, 500)
      }
      return createErrorResponse(`Server error: ${error.message}`, 500)
    }
    
    return createErrorResponse('Internal server error', 500)
  }
}