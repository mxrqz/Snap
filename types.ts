export type ColorScheme = 'light' | 'dark';

export type GradientDirection = 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';

export interface GradientColor {
  color: string;
  position?: number; // 0-100
}

export interface SolidBackground {
  type: 'solid';
  color: string;
}

export interface GradientBackground {
  type: 'gradient';
  direction: GradientDirection;
  colors: GradientColor[];
}

export type BackgroundStyle = SolidBackground | GradientBackground;

export type BrowserMockup = 'safari' | 'chrome' | 'firefox' | 'edge' | 'none';

export interface ViewportConfig {
  width: number;
  height: number;
  isMobile: boolean;
  deviceScaleFactor: number;
}

export interface ScreenshotConfig {
  url: string;
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  delay: number;
  colorScheme: ColorScheme;
  viewport: ViewportConfig;
}

export interface StyleConfig {
  borderRadius: number;
  margin: number;
  background: BackgroundStyle;
  browserMockup: BrowserMockup;
  shadow: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
}

export interface SnapRequest {
  url: string;
  screenshot?: Partial<ScreenshotConfig>;
  style?: Partial<StyleConfig>;
}

export interface SnapResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    originalUrl: string;
    processedAt: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
}

export interface MicrolinkResponse {
  status: string;
  data: {
    screenshot: {
      url: string;
      width: number;
      height: number;
    };
  };
}