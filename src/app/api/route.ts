import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    name: "Snap API",
    version: "1.0.0",
    description: "Screenshot styling API powered by Microlink",
    endpoints: {
      "GET /api/snap": "Generate styled screenshot via query parameters",
      "POST /api/snap": "Generate styled screenshot via JSON body",
      "GET /api/preview": "Preview screenshot in browser",
      "GET /api/docs": "API documentation (Swagger UI)",
      "GET /api/health": "Health check endpoint"
    }
  })
}