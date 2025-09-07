import { NextRequest, NextResponse } from 'next/server'
import { MicrolinkService } from '@/lib/services/microlink'
import type { ScreenshotConfig } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, screenshot } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    // Build screenshot config
    const screenshotConfig: ScreenshotConfig = {
      ...MicrolinkService.getDefaultConfig(),
      ...screenshot,
      url // url should come last to override any defaults
    };

    console.log('Fetching screenshot with config:', screenshotConfig);

    // Get raw screenshot buffer from Microlink
    const screenshotBuffer = await MicrolinkService.fetchScreenshot(screenshotConfig);

    // Convert buffer to base64 data URL
    const base64Image = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageUrl: base64Image,
      metadata: {
        originalUrl: url,
        processedAt: new Date().toISOString(),
        config: screenshotConfig
      }
    });

  } catch (error) {
    console.error('Microlink API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate screenshot' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Build config from query parameters
    const screenshotConfig: ScreenshotConfig = {
      url,
      waitUntil: (searchParams.get('waitUntil') as any) || 'networkidle0',
      delay: parseInt(searchParams.get('delay') || '2000'),
      colorScheme: (searchParams.get('colorScheme') as any) || 'dark',
      viewport: {
        width: parseInt(searchParams.get('viewport.width') || '1920'),
        height: parseInt(searchParams.get('viewport.height') || '1080'),
        isMobile: searchParams.get('viewport.isMobile') === 'true',
        deviceScaleFactor: parseFloat(searchParams.get('viewport.deviceScaleFactor') || '1'),
      }
    };

    console.log('Fetching screenshot with config:', screenshotConfig);

    const screenshotBuffer = await MicrolinkService.fetchScreenshot(screenshotConfig);
    const base64Image = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      imageUrl: base64Image,
      metadata: {
        originalUrl: url,
        processedAt: new Date().toISOString(),
        config: screenshotConfig
      }
    });

  } catch (error) {
    console.error('Microlink API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate screenshot' 
      },
      { status: 500 }
    );
  }
}