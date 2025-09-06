import { z } from 'zod';

const urlRegex = /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/;

export const gradientDirectionSchema = z.enum([
  'to-r', 'to-l', 'to-t', 'to-b', 'to-br', 'to-bl', 'to-tr', 'to-tl'
]);

export const colorSchemeSchema = z.enum(['light', 'dark']);

export const browserMockupSchema = z.enum(['safari', 'chrome', 'firefox', 'edge', 'none']);

export const gradientColorSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/),
  position: z.number().min(0).max(100).optional()
});

export const solidBackgroundSchema = z.object({
  type: z.literal('solid'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/)
});

export const gradientBackgroundSchema = z.object({
  type: z.literal('gradient'),
  direction: gradientDirectionSchema,
  colors: z.array(gradientColorSchema).min(2).max(5)
});

export const backgroundStyleSchema = z.union([solidBackgroundSchema, gradientBackgroundSchema]);

export const viewportConfigSchema = z.object({
  width: z.number().min(320).max(4096).default(1920),
  height: z.number().min(240).max(4096).default(1080),
  isMobile: z.boolean().default(false),
  deviceScaleFactor: z.number().min(0.5).max(3).default(1)
});

export const screenshotConfigSchema = z.object({
  url: z.string().regex(urlRegex, 'Invalid URL format'),
  waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).default('networkidle0'),
  delay: z.number().min(0).max(10000).default(2000),
  colorScheme: colorSchemeSchema.default('dark'),
  viewport: viewportConfigSchema.default({})
});

export const shadowConfigSchema = z.object({
  enabled: z.boolean().default(true),
  blur: z.number().min(0).max(50).default(20),
  offsetX: z.number().min(-50).max(50).default(0),
  offsetY: z.number().min(-50).max(50).default(10),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/).default('#000000'),
  opacity: z.number().min(0).max(1).default(0.15)
});

export const finalImageSizeSchema = z.object({
  width: z.number().min(100).max(4096).optional(),
  height: z.number().min(100).max(4096).optional(),
  aspectRatio: z.string().regex(/^\d+:\d+$/).optional(), // e.g., "16:9", "4:3"
  maintainAspectRatio: z.boolean().default(true)
});

export const styleConfigSchema = z.object({
  borderRadius: z.number().min(0).max(50).default(8),
  margin: z.number().min(0).max(200).default(32),
  background: backgroundStyleSchema.default({
    type: 'gradient',
    direction: 'to-br',
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  }),
  browserMockup: browserMockupSchema.default('none'),
  finalSize: finalImageSizeSchema.optional(),
  shadow: shadowConfigSchema.default({})
});

export const snapRequestSchema = z.object({
  url: z.string().regex(urlRegex, 'Invalid URL format'),
  screenshot: screenshotConfigSchema.partial().optional(),
  style: styleConfigSchema.partial().optional()
});

// Custom number coercion that handles empty strings and invalid values
const safeNumberCoercion = (min?: number, max?: number) => 
  z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(min ?? -Infinity).max(max ?? Infinity).optional());

const safeBooleanCoercion = () =>
  z.preprocess((val) => {
    if (val === '' || val === undefined || val === null) return undefined;
    return val === 'true' || val === true;
  }, z.boolean().optional());

export const snapQuerySchema = z.object({
  url: z.string().regex(urlRegex, 'Invalid URL format'),
  
  waitUntil: z.enum(['load', 'domcontentloaded', 'networkidle0', 'networkidle2']).optional(),
  delay: safeNumberCoercion(0, 10000),
  colorScheme: colorSchemeSchema.optional(),
  
  'viewport.width': safeNumberCoercion(320, 4096),
  'viewport.height': safeNumberCoercion(240, 4096),
  'viewport.isMobile': safeBooleanCoercion(),
  'viewport.deviceScaleFactor': safeNumberCoercion(0.5, 3),
  
  borderRadius: safeNumberCoercion(0, 50),
  margin: safeNumberCoercion(0, 200),
  
  'background.type': z.enum(['solid', 'gradient']).optional(),
  'background.color': z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/).optional(),
  'background.direction': gradientDirectionSchema.optional(),
  'background.colors': z.string().optional(), // JSON string of gradient colors
  
  browserMockup: browserMockupSchema.optional(),
  
  // Final image size parameters
  'finalSize.width': safeNumberCoercion(100, 4096),
  'finalSize.height': safeNumberCoercion(100, 4096),
  'finalSize.aspectRatio': z.string().regex(/^\d+:\d+$/).optional(),
  'finalSize.maintainAspectRatio': safeBooleanCoercion(),
  
  'shadow.enabled': safeBooleanCoercion(),
  'shadow.blur': safeNumberCoercion(0, 50),
  'shadow.offsetX': safeNumberCoercion(-50, 50),
  'shadow.offsetY': safeNumberCoercion(-50, 50),
  'shadow.color': z.string().regex(/^#[0-9A-Fa-f]{6}$|^#[0-9A-Fa-f]{3}$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/).optional(),
  'shadow.opacity': safeNumberCoercion(0, 1)
});

export type SnapRequestInput = z.input<typeof snapRequestSchema>;
export type SnapQueryInput = z.input<typeof snapQuerySchema>;
export type ValidatedSnapRequest = z.output<typeof snapRequestSchema>;
export type ValidatedSnapQuery = z.output<typeof snapQuerySchema>;

export function validateSnapRequest(data: unknown): ValidatedSnapRequest {
  return snapRequestSchema.parse(data);
}

export function validateSnapQuery(data: unknown): ValidatedSnapQuery {
  return snapQuerySchema.parse(data);
}

export function queryToRequest(query: ValidatedSnapQuery): ValidatedSnapRequest {
  const request: ValidatedSnapRequest = {
    url: query.url,
    screenshot: {},
    style: {}
  };

  if (query.waitUntil) request.screenshot!.waitUntil = query.waitUntil;
  if (query.delay) request.screenshot!.delay = query.delay;
  if (query.colorScheme) request.screenshot!.colorScheme = query.colorScheme;

  if (query['viewport.width'] || query['viewport.height'] || query['viewport.isMobile'] !== undefined || query['viewport.deviceScaleFactor']) {
    request.screenshot!.viewport = {} as any;
    if (query['viewport.width']) request.screenshot!.viewport!.width = query['viewport.width'];
    if (query['viewport.height']) request.screenshot!.viewport!.height = query['viewport.height'];
    if (query['viewport.isMobile'] !== undefined) request.screenshot!.viewport!.isMobile = query['viewport.isMobile'];
    if (query['viewport.deviceScaleFactor']) request.screenshot!.viewport!.deviceScaleFactor = query['viewport.deviceScaleFactor'];
  }

  if (query.borderRadius) request.style!.borderRadius = query.borderRadius;
  if (query.margin) request.style!.margin = query.margin;
  if (query.browserMockup) request.style!.browserMockup = query.browserMockup;

  if (query['background.type'] || query['background.color'] || query['background.direction'] || query['background.colors']) {
    if (query['background.type'] === 'solid' && query['background.color']) {
      request.style!.background = {
        type: 'solid',
        color: query['background.color']
      };
    } else if (query['background.type'] === 'gradient' && query['background.colors']) {
      try {
        const colors = JSON.parse(query['background.colors']);
        request.style!.background = {
          type: 'gradient',
          direction: query['background.direction'] || 'to-br',
          colors: Array.isArray(colors) ? colors : []
        };
      } catch (e) {
        // Invalid JSON, ignore
      }
    }
  }

  // Handle finalSize parameters
  if (query['finalSize.width'] || query['finalSize.height'] || query['finalSize.aspectRatio'] || query['finalSize.maintainAspectRatio'] !== undefined) {
    request.style!.finalSize = {};
    if (query['finalSize.width']) request.style!.finalSize.width = query['finalSize.width'];
    if (query['finalSize.height']) request.style!.finalSize.height = query['finalSize.height'];
    if (query['finalSize.aspectRatio']) request.style!.finalSize.aspectRatio = query['finalSize.aspectRatio'];
    if (query['finalSize.maintainAspectRatio'] !== undefined) request.style!.finalSize.maintainAspectRatio = query['finalSize.maintainAspectRatio'];
  }

  if (query['shadow.enabled'] !== undefined || query['shadow.blur'] || query['shadow.offsetX'] || query['shadow.offsetY'] || query['shadow.color'] || query['shadow.opacity']) {
    request.style!.shadow = {} as any;
    if (query['shadow.enabled'] !== undefined) request.style!.shadow!.enabled = query['shadow.enabled'];
    if (query['shadow.blur']) request.style!.shadow!.blur = query['shadow.blur'];
    if (query['shadow.offsetX']) request.style!.shadow!.offsetX = query['shadow.offsetX'];
    if (query['shadow.offsetY']) request.style!.shadow!.offsetY = query['shadow.offsetY'];
    if (query['shadow.color']) request.style!.shadow!.color = query['shadow.color'];
    if (query['shadow.opacity']) request.style!.shadow!.opacity = query['shadow.opacity'];
  }

  return request;
}