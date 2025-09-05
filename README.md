# 📸 Snap API

> Beautiful styled screenshots API powered by Microlink - Create ray.so-style images for websites

[![API Status](https://img.shields.io/badge/status-active-brightgreen)](http://localhost:3000/health)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-brightgreen)](http://localhost:3000/docs)

Transform any website into a beautiful, styled screenshot with custom gradients, shadows, browser mockups, and more. Perfect for social media, presentations, and portfolios.

## ✨ Features

- 🎨 **Custom Styling**: Gradients, solid colors, borders, shadows
- 🌐 **Browser Mockups**: Safari, Chrome, Firefox, Edge frames
- 📱 **Responsive**: Custom viewport sizes and mobile simulation
- ⚡ **Fast**: Built with Bun for maximum performance
- 🔒 **Type Safe**: Full TypeScript implementation with Zod validation
- 📚 **Well Documented**: Complete OpenAPI/Swagger documentation
- 🖼️ **Multiple Outputs**: JSON API, HTML preview, CLI tools

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Node.js 18+ (for compatibility)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd snap

# Install dependencies
bun install

# Start the development server
bun run dev
```

The API will be available at `http://localhost:3000`

## 📖 Documentation

### Interactive API Documentation

Visit `http://localhost:3000/docs` for complete interactive Swagger UI documentation with:

- 📝 Detailed endpoint descriptions
- 🧪 Try-it-out functionality
- 📋 Request/response examples
- 🔧 Parameter validation

### Quick Reference

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/` | GET | API information and endpoints |
| `/health` | GET | Health check |
| `/snap` | GET/POST | Generate styled screenshot |
| `/preview` | GET | Browser preview with download |
| `/docs` | GET | Swagger UI documentation |
| `/openapi.json` | GET | OpenAPI specification |

## 🎯 Usage Examples

### 1. Simple Screenshot (GET)

```bash
curl "http://localhost:3000/snap?url=https://example.com"
```

### 2. Styled Screenshot (GET)

```bash
curl "http://localhost:3000/snap?url=https://github.com&borderRadius=15&margin=40&browserMockup=safari"
```

### 3. Advanced Configuration (POST)

```bash
curl -X POST "http://localhost:3000/snap" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://tailwindcss.com",
    "screenshot": {
      "viewport": {
        "width": 1280,
        "height": 720
      },
      "colorScheme": "dark",
      "delay": 3000
    },
    "style": {
      "borderRadius": 12,
      "margin": 60,
      "background": {
        "type": "gradient",
        "direction": "to-r",
        "colors": [
          {"color": "#FF6B6B", "position": 0},
          {"color": "#4ECDC4", "position": 50},
          {"color": "#45B7D1", "position": 100}
        ]
      },
      "browserMockup": "chrome",
      "shadow": {
        "enabled": true,
        "blur": 25,
        "offsetY": 15,
        "opacity": 0.2
      }
    }
  }'
```

### 4. Browser Preview

```bash
# Open in browser
open "http://localhost:3000/preview?url=https://example.com&borderRadius=15&margin=40"
```

### 5. Save to File (CLI)

```bash
# Simple save
bun save-image.ts https://example.com

# With styling options
bun save-image.ts https://github.com \
  --border-radius 15 \
  --margin 40 \
  --background "#ffffff" \
  --browser safari \
  --output my-screenshot.png
```

## 🎨 Styling Options

### Background Types

#### Solid Color
```json
{
  "background": {
    "type": "solid",
    "color": "#ffffff"
  }
}
```

#### Gradient
```json
{
  "background": {
    "type": "gradient",
    "direction": "to-br",
    "colors": [
      {"color": "#667eea", "position": 0},
      {"color": "#764ba2", "position": 100}
    ]
  }
}
```

**Gradient Directions**: `to-r`, `to-l`, `to-t`, `to-b`, `to-br`, `to-bl`, `to-tr`, `to-tl`

### Browser Mockups

- `safari` - Safari browser with macOS styling
- `chrome` - Chrome browser with clean design
- `firefox` - Firefox browser styling
- `edge` - Microsoft Edge styling
- `none` - No browser frame (default)

### Shadow Configuration

```json
{
  "shadow": {
    "enabled": true,
    "blur": 20,
    "offsetX": 0,
    "offsetY": 10,
    "color": "#000000",
    "opacity": 0.15
  }
}
```

### Viewport Options

```json
{
  "viewport": {
    "width": 1920,
    "height": 1080,
    "isMobile": false,
    "deviceScaleFactor": 1
  }
}
```

## 📊 API Response Format

### Success Response

```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  "metadata": {
    "originalUrl": "https://example.com",
    "processedAt": "2023-12-07T10:30:00.000Z",
    "dimensions": {
      "width": 1984,
      "height": 1144
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Validation error: Invalid URL format"
}
```

## 🔧 Configuration Parameters

### Screenshot Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `url` | string | URI | required | Website URL to screenshot |
| `waitUntil` | string | enum | `networkidle0` | When to consider loading complete |
| `delay` | integer | 0-10000 | 2000 | Additional delay in milliseconds |
| `colorScheme` | string | light/dark | `dark` | Page color scheme preference |

### Style Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `borderRadius` | integer | 0-50 | 8 | Border radius in pixels |
| `margin` | integer | 0-200 | 32 | Margin around image |
| `browserMockup` | string | enum | `none` | Browser frame style |

### Viewport Parameters

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `viewport.width` | integer | 320-4096 | 1920 | Viewport width |
| `viewport.height` | integer | 240-4096 | 1080 | Viewport height |
| `viewport.isMobile` | boolean | - | false | Mobile simulation |
| `viewport.deviceScaleFactor` | number | 0.5-3 | 1 | Device pixel ratio |

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
bun test

# Run specific test file
bun test test/validation.test.ts

# Run integration tests (requires server running)
bun run dev  # In another terminal
bun test test/integration.test.ts
```

## 📁 Project Structure

```
snap/
├── index.ts              # Main server and API endpoints
├── types.ts              # TypeScript type definitions
├── validation.ts         # Zod validation schemas
├── openapi.json          # OpenAPI/Swagger specification
├── save-image.ts         # CLI tool for saving images
├── demo.ts              # Usage examples and demos
├── services/
│   ├── microlink.ts     # Microlink API integration
│   ├── image-processor.ts # Image styling with Sharp
│   └── browser-mockup.ts # Browser frame generation
├── test/
│   ├── validation.test.ts
│   ├── microlink-service.test.ts
│   └── integration.test.ts
└── screenshots/         # Output directory for saved images
```

## 🚨 Error Handling

The API provides detailed error messages for different failure scenarios:

- **400 Bad Request**: Invalid parameters or malformed requests
- **503 Service Unavailable**: Microlink API unavailable or rate limited
- **500 Internal Server Error**: Image processing or server errors

All errors follow the consistent format:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## 🔄 Rate Limiting

This API uses the Microlink service for screenshots. Be mindful of:

- Microlink's rate limits and pricing
- Large images may take longer to process
- Complex styling operations increase processing time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Ensure all tests pass: `bun test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [Microlink](https://microlink.io/) for the screenshot API
- [Sharp](https://sharp.pixelplumbing.com/) for image processing
- [Bun](https://bun.sh/) for the runtime
- [Zod](https://zod.dev/) for validation

---

**Ready to create beautiful screenshots?** 🚀

Start the server with `bun run dev` and visit `http://localhost:3000/docs` for interactive documentation!