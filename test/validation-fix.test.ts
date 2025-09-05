import { test, expect } from "bun:test";
import { validateSnapQuery } from "../validation.js";

test("should handle empty string parameters without throwing", () => {
  const queryWithEmptyValues = {
    url: "https://example.com",
    margin: "", // Empty string that would become NaN
    borderRadius: "",
    delay: ""
  };
  
  const result = validateSnapQuery(queryWithEmptyValues);
  
  expect(result.url).toBe("https://example.com");
  // Empty values should be converted to undefined, not NaN
  expect(result.margin).toBeUndefined();
  expect(result.borderRadius).toBeUndefined();
  expect(result.delay).toBeUndefined();
});

test("should handle invalid numeric values gracefully", () => {
  const queryWithInvalidNumbers = {
    url: "https://example.com",
    margin: "not-a-number",
    borderRadius: "abc",
    delay: "invalid"
  };
  
  const result = validateSnapQuery(queryWithInvalidNumbers);
  
  expect(result.url).toBe("https://example.com");
  // Invalid numbers should be converted to undefined
  expect(result.margin).toBeUndefined();
  expect(result.borderRadius).toBeUndefined();
  expect(result.delay).toBeUndefined();
});

test("should accept valid numeric strings", () => {
  const queryWithValidNumbers = {
    url: "https://example.com",
    margin: "20",
    borderRadius: "15",
    delay: "3000"
  };
  
  const result = validateSnapQuery(queryWithValidNumbers);
  
  expect(result.url).toBe("https://example.com");
  expect(result.margin).toBe(20);
  expect(result.borderRadius).toBe(15);
  expect(result.delay).toBe(3000);
});

test("should handle boolean values correctly", () => {
  const queryWithBooleans = {
    url: "https://example.com",
    "viewport.isMobile": "true",
    "shadow.enabled": "false"
  };
  
  const result = validateSnapQuery(queryWithBooleans);
  
  expect(result.url).toBe("https://example.com");
  expect(result["viewport.isMobile"]).toBe(true);
  expect(result["shadow.enabled"]).toBe(false);
});

test("should handle empty boolean values", () => {
  const queryWithEmptyBooleans = {
    url: "https://example.com",
    "viewport.isMobile": "",
    "shadow.enabled": ""
  };
  
  const result = validateSnapQuery(queryWithEmptyBooleans);
  
  expect(result.url).toBe("https://example.com");
  expect(result["viewport.isMobile"]).toBeUndefined();
  expect(result["shadow.enabled"]).toBeUndefined();
});