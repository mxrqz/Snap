import { test, expect } from "bun:test";
import { validateSnapRequest, validateSnapQuery, queryToRequest } from "../src/lib/validation";

test("should validate a basic snap request", () => {
  const validRequest = {
    url: "https://example.com"
  };
  
  const result = validateSnapRequest(validRequest);
  expect(result.url).toBe("https://example.com");
});

test("should reject invalid URL", () => {
  const invalidRequest = {
    url: "not-a-url"
  };
  
  expect(() => validateSnapRequest(invalidRequest)).toThrow();
});

test("should validate snap request with style options", () => {
  const requestWithStyle = {
    url: "https://example.com",
    style: {
      borderRadius: 15,
      margin: 40,
      background: {
        type: "gradient" as const,
        direction: "to-br" as const,
        colors: [
          { color: "#ff0000", position: 0 },
          { color: "#0000ff", position: 100 }
        ]
      }
    }
  };
  
  const result = validateSnapRequest(requestWithStyle);
  expect(result.url).toBe("https://example.com");
  expect(result.style?.borderRadius).toBe(15);
  expect(result.style?.background.type).toBe("gradient");
});

test("should validate query parameters and convert to request", () => {
  const queryParams = {
    url: "https://example.com",
    borderRadius: "10",
    margin: "20",
    "background.type": "solid" as const,
    "background.color": "#ffffff"
  };
  
  const validatedQuery = validateSnapQuery(queryParams);
  const request = queryToRequest(validatedQuery);
  
  expect(request.url).toBe("https://example.com");
  expect(request.style?.borderRadius).toBe(10);
  expect(request.style?.margin).toBe(20);
  expect(request.style?.background?.type).toBe("solid");
});

test("should reject invalid color format", () => {
  const invalidRequest = {
    url: "https://example.com",
    style: {
      background: {
        type: "solid" as const,
        color: "invalid-color"
      }
    }
  };
  
  expect(() => validateSnapRequest(invalidRequest)).toThrow();
});

test("should validate browser mockup options", () => {
  const requestWithMockup = {
    url: "https://example.com",
    style: {
      browserMockup: "safari" as const
    }
  };
  
  const result = validateSnapRequest(requestWithMockup);
  expect(result.style?.browserMockup).toBe("safari");
});

test("should validate shadow configuration", () => {
  const requestWithShadow = {
    url: "https://example.com",
    style: {
      shadow: {
        enabled: true,
        blur: 15,
        offsetX: 5,
        offsetY: 5,
        color: "#000000",
        opacity: 0.3
      }
    }
  };
  
  const result = validateSnapRequest(requestWithShadow);
  expect(result.style?.shadow?.enabled).toBe(true);
  expect(result.style?.shadow?.blur).toBe(15);
  expect(result.style?.shadow?.opacity).toBe(0.3);
});