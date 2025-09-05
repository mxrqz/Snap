#!/usr/bin/env bun

console.log('🔧 Testing Microlink API direct image response fix');
console.log('==================================================');

const testUrls = [
  {
    name: 'Simple test with your site',
    url: 'http://localhost:3000/snap?url=https://snip.mxrqz.com&borderRadius=15&margin=40'
  },
  {
    name: 'Test with Example.com',  
    url: 'http://localhost:3000/snap?url=https://example.com&margin=20'
  },
  {
    name: 'POST request test',
    method: 'POST',
    url: 'http://localhost:3000/snap',
    body: {
      url: "https://snip.mxrqz.com",
      style: {
        borderRadius: 10,
        margin: 30,
        background: {
          type: "solid",
          color: "#ffffff"
        }
      }
    }
  }
];

for (const testCase of testUrls) {
  console.log(`\n🧪 ${testCase.name}:`);
  
  try {
    let response;
    
    if (testCase.method === 'POST') {
      response = await fetch(testCase.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCase.body)
      });
    } else {
      response = await fetch(testCase.url);
    }
    
    const data = await response.json();
    
    if (response.status === 200) {
      console.log('   ✅ SUCCESS! Screenshot generated');
      console.log(`   📊 Image size: ${data.imageUrl ? 'Available' : 'Missing'}`);
      console.log(`   📏 Dimensions: ${data.metadata?.dimensions?.width}x${data.metadata?.dimensions?.height}`);
      console.log(`   🕒 Processed: ${data.metadata?.processedAt}`);
    } else if (response.status === 503) {
      console.log('   ⚠️  Service unavailable (likely Microlink API rate limit or network issue)');
      console.log(`   📝 Error: ${data.error?.slice(0, 100)}...`);
    } else if (response.status === 400) {
      console.log('   ❌ Validation error (this should not happen with valid URLs)');
      console.log(`   📝 Error: ${data.error}`);
    } else {
      console.log(`   ❓ Unexpected status: ${response.status}`);
      console.log(`   📝 Error: ${data.error?.slice(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Network/Connection error: ${error}`);
  }
  
  // Small delay between requests
  await new Promise(resolve => setTimeout(resolve, 1000));
}

console.log('\n📋 What was fixed:');
console.log('   • Microlink API sometimes returns image/png directly instead of JSON');
console.log('   • Added detection for content-type: image/* responses');
console.log('   • Handle both direct image and JSON response formats');
console.log('   • Better logging to understand response types');

console.log('\n✅ The "Expected JSON response, got: image/png" error should be fixed!');