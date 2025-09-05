# 🚀 Getting Started with Snap API

Quick guide to get up and running with beautiful styled screenshots!

## 🏃‍♂️ 5-Minute Quick Start

### 1. Install & Run

```bash
# Install dependencies
bun install

# Start the server
bun run dev
```

Server starts at: `http://localhost:3000`

### 2. Test Your First Screenshot

**Option A: Browser Preview (Easiest)**
```
http://localhost:3000/preview?url=https://example.com
```

**Option B: API Call**
```bash
curl "http://localhost:3000/snap?url=https://example.com"
```

### 3. Explore Documentation
```
http://localhost:3000/docs
```

## 🎯 Common Use Cases

### Social Media Screenshots
```bash
curl "http://localhost:3000/snap?url=https://github.com/your-repo&borderRadius=15&margin=40&browserMockup=safari"
```

### Portfolio Showcase
```bash
curl -X POST "http://localhost:3000/snap" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-website.com",
    "style": {
      "borderRadius": 20,
      "margin": 60,
      "background": {
        "type": "gradient",
        "direction": "to-br",
        "colors": [
          {"color": "#667eea", "position": 0},
          {"color": "#764ba2", "position": 100}
        ]
      },
      "browserMockup": "safari",
      "shadow": {
        "enabled": true,
        "blur": 30,
        "offsetY": 20,
        "opacity": 0.25
      }
    }
  }'
```

### Presentation Screenshots
```bash
# Clean, professional look
curl "http://localhost:3000/snap?url=https://docs.site.com&background.type=solid&background.color=%23ffffff&borderRadius=8&margin=50&browserMockup=chrome"
```

## 🔧 Quick CLI Tool

Save screenshots directly to files:

```bash
# Simple save
bun save-image.ts https://example.com

# With custom styling
bun save-image.ts https://your-site.com \
  --border-radius 15 \
  --margin 40 \
  --browser safari \
  --output my-awesome-screenshot.png
```

Files saved to: `./screenshots/`

## 📱 Testing Different Devices

### Mobile Screenshot
```bash
curl "http://localhost:3000/snap?url=https://example.com&viewport.width=375&viewport.height=667&viewport.isMobile=true"
```

### Tablet Screenshot
```bash
curl "http://localhost:3000/snap?url=https://example.com&viewport.width=768&viewport.height=1024"
```

### Desktop Screenshot
```bash
curl "http://localhost:3000/snap?url=https://example.com&viewport.width=1920&viewport.height=1080"
```

## 🎨 Styling Presets

### Gradient Backgrounds

**Blue to Purple**
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

**Warm Sunset**
```json
{
  "background": {
    "type": "gradient", 
    "direction": "to-r",
    "colors": [
      {"color": "#FF6B6B", "position": 0},
      {"color": "#4ECDC4", "position": 50},
      {"color": "#45B7D1", "position": 100}
    ]
  }
}
```

**Ocean Wave**
```json
{
  "background": {
    "type": "gradient",
    "direction": "to-bl",
    "colors": [
      {"color": "#00d2ff", "position": 0},
      {"color": "#3a7bd5", "position": 100}
    ]
  }
}
```

## 🔍 Debugging Tips

### Check API Health
```bash
curl http://localhost:3000/health
```

### Validate Your URLs
Make sure your URLs are fully qualified:
- ✅ `https://example.com`
- ❌ `example.com`

### Common Issues

**Empty Parameters**: Use empty string instead of undefined
```bash
# ❌ This might cause NaN errors
curl "http://localhost:3000/snap?url=https://example.com&margin="

# ✅ Better to omit completely
curl "http://localhost:3000/snap?url=https://example.com"
```

**Rate Limiting**: If you get 503 errors, wait a moment and try again (Microlink API limits)

## 📚 Next Steps

1. **Explore Full Documentation**: Visit `http://localhost:3000/docs`
2. **Try Different Styling Options**: Check the main README
3. **Integrate with Your App**: Use the API endpoints in your projects
4. **Save Images Locally**: Use the CLI tool for batch processing

## 🤝 Need Help?

- 📖 **Full Documentation**: Check `README.md`
- 🔧 **API Reference**: Visit `http://localhost:3000/docs` 
- 🧪 **Examples**: Run `bun demo.ts`
- ❓ **Issues**: Create an issue in the repository

---

**Happy screenshotting!** 📸✨