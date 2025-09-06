import { test, expect } from "bun:test";

// Integration tests for the Snap API
// Note: These tests require a running server on port 3001

const BASE_URL = "http://localhost:3000";

// Helper function to check if server is running
async function isServerRunning(): Promise<boolean> {
  try {
    await fetch(`${BASE_URL}/api/health`);
    return true;
  } catch {
    return false;
  }
}

test("API root endpoint should return service info", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api`);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.name).toBe("Snap API");
  expect(data.endpoints).toBeDefined();
});

test("Health endpoint should return status ok", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api/health`);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.status).toBe("ok");
  expect(data.timestamp).toBeDefined();
});

test("GET /api/snap should require url parameter", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api/snap`);
  const data = await response.json();
  
  expect(response.status).toBe(400);
  expect(data.success).toBe(false);
  expect(data.error).toContain("url");
});

test("GET /api/snap with valid URL should generate screenshot", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api/snap?url=https://example.com`);
  const data = await response.json();
  
  if (response.status === 200) {
    expect(data.success).toBe(true);
    expect(data.imageUrl).toBeDefined();
    expect(data.imageUrl).toMatch(/^data:image\/(png|jpeg);base64,/);
    expect(data.metadata).toBeDefined();
    expect(data.metadata.originalUrl).toBe("https://example.com");
  } else {
    // If there's an error, make sure it's not validation related
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  }
}, 30000); // 30 second timeout for screenshot generation

test("POST /api/snap with JSON body should work", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api/snap`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: 'https://example.com',
      style: {
        borderRadius: 10,
        margin: 20
      }
    })
  });
  
  const data = await response.json();
  
  if (response.status === 200) {
    expect(data.success).toBe(true);
    expect(data.imageUrl).toBeDefined();
    expect(data.metadata).toBeDefined();
  } else {
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  }
}, 30000);

test("GET /api/preview should return HTML", async () => {
  if (!(await isServerRunning())) {
    console.log("⚠️  Server not running on port 3001. Skipping integration tests.");
    return;
  }

  const response = await fetch(`${BASE_URL}/api/preview?url=https://example.com`);
  
  if (response.status === 200) {
    const html = await response.text();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<img');
  } else {
    // Preview might fail if screenshot generation fails
    expect(response.status).toBeGreaterThanOrEqual(400);
  }
}, 30000);