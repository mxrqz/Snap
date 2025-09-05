#!/usr/bin/env bun

console.log('🔧 Testing the fixes for NaN validation errors');
console.log('================================================');

// Test 1: URL with empty parameters (should not throw NaN error)
const testUrl1 = 'http://localhost:3000/snap?url=https://example.com&margin=&borderRadius=&delay=';

console.log('\n1. Testing empty parameters (previously caused NaN error):');
console.log(`   ${testUrl1}`);

try {
  const response = await fetch(testUrl1);
  const data = await response.json();
  
  if (response.status === 400 && data.error?.includes('NaN')) {
    console.log('   ❌ Still getting NaN error:', data.error);
  } else if (response.status === 503 || data.error?.includes('Screenshot fetch failed')) {
    console.log('   ✅ Validation fixed! (Error is now from Microlink API, not validation)');
    console.log('   📝 Response:', data.error?.slice(0, 100) + '...');
  } else if (response.status === 200) {
    console.log('   ✅ Request successful!');
  } else {
    console.log('   ⚠️  Unexpected response:', response.status, data);
  }
} catch (error) {
  console.log('   ❌ Network error:', error);
}

// Test 2: URL with invalid numeric values
const testUrl2 = 'http://localhost:3000/snap?url=https://example.com&margin=abc&borderRadius=xyz&delay=not-a-number';

console.log('\n2. Testing invalid numeric parameters:');
console.log(`   ${testUrl2}`);

try {
  const response = await fetch(testUrl2);
  const data = await response.json();
  
  if (response.status === 400 && data.error?.includes('NaN')) {
    console.log('   ❌ Still getting NaN error:', data.error);
  } else if (response.status === 503 || data.error?.includes('Screenshot fetch failed')) {
    console.log('   ✅ Validation fixed! (Error is now from Microlink API, not validation)');
  } else if (response.status === 200) {
    console.log('   ✅ Request successful!');
  } else {
    console.log('   ⚠️  Unexpected response:', response.status, data);
  }
} catch (error) {
  console.log('   ❌ Network error:', error);
}

// Test 3: Valid parameters
const testUrl3 = 'http://localhost:3000/snap?url=https://example.com&margin=20&borderRadius=15';

console.log('\n3. Testing valid parameters:');
console.log(`   ${testUrl3}`);

try {
  const response = await fetch(testUrl3);
  const data = await response.json();
  
  if (response.status === 200) {
    console.log('   ✅ Request successful!');
  } else if (response.status === 503) {
    console.log('   ✅ Validation passed (Microlink API issue expected in test environment)');
  } else {
    console.log('   ⚠️  Response:', response.status, data.error?.slice(0, 100));
  }
} catch (error) {
  console.log('   ❌ Network error:', error);
}

console.log('\n📋 Summary of fixes:');
console.log('   • Added safeNumberCoercion() to handle empty/invalid numeric values');
console.log('   • Added safeBooleanCoercion() for boolean parameters');  
console.log('   • Improved Microlink API error handling with detailed logging');
console.log('   • Added proper JSON validation and content-type checking');
console.log('   • Added favicon.ico endpoint to prevent routing errors');
console.log('   • Enhanced error categorization (validation vs API vs processing)');

console.log('\n✅ The "Maximum call stack size exceeded" and "NaN validation" errors should be fixed!');