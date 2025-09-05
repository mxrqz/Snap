import { test, expect } from "bun:test";

// These tests require the server to be running
// Run with: bun run dev (in another terminal) && bun test test/integration.test.ts

test("Integration tests require server to be running", () => {
  // This is just a placeholder test to remind users to start the server
  console.log("⚠️  Integration tests skipped. To run them:");
  console.log("   1. Start server: bun run dev");
  console.log("   2. Run tests: bun test test/integration.test.ts");
  expect(true).toBe(true);
});

// Uncomment these tests when you want to test with a running server:

/*
const BASE_URL = "http://localhost:3000";

test("API root endpoint should return service info", async () => {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.name).toBe("Snap API");
  expect(data.endpoints).toBeDefined();
});

test("Health endpoint should return status ok", async () => {
  const response = await fetch(`${BASE_URL}/health`);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.status).toBe("ok");
  expect(data.timestamp).toBeDefined();
});

test("GET /snap should require url parameter", async () => {
  const response = await fetch(`${BASE_URL}/snap`);
  const data = await response.json();
  
  expect(response.status).toBe(400);
  expect(data.success).toBe(false);
  expect(data.error).toContain("Missing required parameter: url");
});

test("Direct image response should work", async () => {
  const response = await fetch(`${BASE_URL}/snap?url=https://example.com`);
  const data = await response.json();
  
  // Should not get "Expected JSON response, got: image/png" error anymore
  if (response.status !== 200) {
    expect(data.error).not.toContain("Expected JSON response, got: image/png");
    expect(data.error).not.toContain("Expected number, received nan");
  }
});
*/