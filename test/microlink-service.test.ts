import { test, expect } from "bun:test";
import { MicrolinkService } from "../services/microlink.js";

test("should generate correct Microlink API URL", () => {
  const config = {
    url: "https://example.com",
    waitUntil: "networkidle0" as const,
    delay: 2000,
    colorScheme: "dark" as const,
    viewport: {
      width: 1920,
      height: 1080,
      isMobile: false,
      deviceScaleFactor: 1
    }
  };
  
  const apiUrl = MicrolinkService.getScreenshotUrl(config);
  
  expect(apiUrl).toContain("api.microlink.io");
  expect(apiUrl).toContain("url=https%3A%2F%2Fexample.com");
  expect(apiUrl).toContain("screenshot=true");
  expect(apiUrl).toContain("waitUntil=networkidle0");
  expect(apiUrl).toContain("colorScheme=dark");
  expect(apiUrl).toContain("viewport.width=1920");
  expect(apiUrl).toContain("viewport.height=1080");
  expect(apiUrl).toContain("viewport.isMobile=false");
  expect(apiUrl).toContain("delay=2000");
});

test("should have reasonable default config", () => {
  const defaultConfig = MicrolinkService.getDefaultConfig();
  
  expect(defaultConfig.waitUntil).toBe("networkidle0");
  expect(defaultConfig.delay).toBe(2000);
  expect(defaultConfig.colorScheme).toBe("dark");
  expect(defaultConfig.viewport.width).toBe(1920);
  expect(defaultConfig.viewport.height).toBe(1080);
  expect(defaultConfig.viewport.isMobile).toBe(false);
  expect(defaultConfig.viewport.deviceScaleFactor).toBe(1);
});

test("should properly encode special characters in URL", () => {
  const config = {
    url: "https://example.com/path with spaces?param=value&other=test",
    waitUntil: "networkidle0" as const,
    delay: 1000,
    colorScheme: "light" as const,
    viewport: {
      width: 1280,
      height: 720,
      isMobile: true,
      deviceScaleFactor: 2
    }
  };
  
  const apiUrl = MicrolinkService.getScreenshotUrl(config);
  
  // Check that the URL is properly encoded (spaces become + in query params)
  expect(apiUrl).toContain("url=https%3A%2F%2Fexample.com%2Fpath+with+spaces%3Fparam%3Dvalue%26other%3Dtest");
  expect(apiUrl).toContain("viewport.isMobile=true");
  expect(apiUrl).toContain("viewport.deviceScaleFactor=2");
});