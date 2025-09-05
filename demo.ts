#!/usr/bin/env bun

console.log('🚀 Snap API Demo');
console.log('================');
console.log('');

console.log('🖼️ How to visualize images:');
console.log('');
console.log('1. Browser Preview (Easiest):');
console.log('   Open: http://localhost:3000/preview?url=https://example.com&borderRadius=15');
console.log('');
console.log('2. Save to file:');
console.log('   bun save-image.ts https://example.com --border-radius 15 --margin 40');
console.log('');
console.log('3. Get base64 in JSON and decode manually');
console.log('');

console.log('📋 Example usage:');
console.log('');

console.log('1. GET request with query parameters:');
console.log('   curl "http://localhost:3000/snap?url=https://example.com&borderRadius=15&margin=40"');
console.log('');

console.log('2. POST request with JSON body:');
console.log(`   curl -X POST "http://localhost:3000/snap" \\
     -H "Content-Type: application/json" \\
     -d '{
       "url": "https://example.com",
       "style": {
         "borderRadius": 15,
         "margin": 40,
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
           "blur": 20,
           "offsetY": 10,
           "color": "#000000",
           "opacity": 0.15
         }
       }
     }'`);
console.log('');

console.log('3. Advanced styling example:');
console.log(`   curl -X POST "http://localhost:3000/snap" \\
     -H "Content-Type: application/json" \\
     -d '{
       "url": "https://github.com",
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
           "offsetX": 0,
           "offsetY": 15,
           "color": "#000000",
           "opacity": 0.2
         }
       }
     }'`);
console.log('');

console.log('🔧 Available options:');
console.log('');
console.log('Screenshot options:');
console.log('  • waitUntil: load, domcontentloaded, networkidle0, networkidle2');
console.log('  • delay: 0-10000ms');
console.log('  • colorScheme: light, dark');
console.log('  • viewport: width, height, isMobile, deviceScaleFactor');
console.log('');

console.log('Style options:');
console.log('  • borderRadius: 0-50px');
console.log('  • margin: 0-200px');
console.log('  • background: solid color or gradient');
console.log('  • browserMockup: safari, chrome, firefox, edge, none');
console.log('  • shadow: blur, offset, color, opacity');
console.log('');

console.log('🌈 Background gradient directions:');
console.log('  • to-r, to-l, to-t, to-b');
console.log('  • to-br, to-bl, to-tr, to-tl');
console.log('');

console.log('🎨 Color formats supported:');
console.log('  • Hex: #ff0000, #f00');
console.log('  • RGB: rgb(255, 0, 0)');
console.log('  • RGBA: rgba(255, 0, 0, 0.5)');
console.log('  • HSL: hsl(0, 100%, 50%)');
console.log('');

console.log('To start the server: bun run dev');
console.log('To run tests: bun test');
console.log('');
console.log('🎯 Ready to create beautiful styled screenshots!');