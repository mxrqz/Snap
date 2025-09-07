"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FloatingDock, FloatingDockItem } from '@/components/ui/floating-dock';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { 
  Globe, 
  Upload, 
  Download, 
  History, 
  Palette, 
  Settings,
  Monitor,
  Image as ImageIcon,
  Copy,
  RefreshCw,
  Smartphone,
  Chrome,
  Eye,
  Save,
  Layers
} from 'lucide-react';

// Types based on API research
interface ScreenshotConfig {
  url: string;
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  delay: number;
  colorScheme: 'light' | 'dark';
  viewport: {
    width: number;
    height: number;
    isMobile: boolean;
    deviceScaleFactor: number;
  };
}

interface StyleConfig {
  borderRadius: number;
  margin: number;
  background: {
    type: 'solid' | 'gradient';
    color?: string;
    direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
    colors?: Array<{ color: string; position?: number }>;
  };
  browserMockup: 'safari' | 'chrome' | 'firefox' | 'edge' | 'none';
  shadow: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
}

interface EditorState {
  screenshot: ScreenshotConfig;
  style: StyleConfig;
  previewUrl?: string;
  isLoading: boolean;
  uploadedImage?: File;
  baseImageUrl?: string; // URL of the base screenshot from backend
  lastScreenshotConfig?: ScreenshotConfig; // Track config used for current base image
}

// Default values from API research
const DEFAULT_SCREENSHOT: ScreenshotConfig = {
  url: '',
  waitUntil: 'networkidle0',
  delay: 2000,
  colorScheme: 'dark',
  viewport: {
    width: 1920,
    height: 1080,
    isMobile: false,
    deviceScaleFactor: 1,
  }
};

const DEFAULT_STYLE: StyleConfig = {
  borderRadius: 8,
  margin: 32,
  background: {
    type: 'gradient',
    direction: 'to-br',
    colors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 100 }
    ]
  },
  browserMockup: 'none',
  shadow: {
    enabled: false,
    blur: 8,
    offsetX: 0,
    offsetY: 4,
    color: '#000000',
    opacity: 0.08
  }
};

const PRESET_GRADIENTS = [
  { name: 'Ocean Blue', colors: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], direction: 'to-br' as const },
  { name: 'Sunset', colors: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 100 }], direction: 'to-r' as const },
  { name: 'Forest', colors: [{ color: '#134e5e', position: 0 }, { color: '#71b280', position: 100 }], direction: 'to-t' as const },
  { name: 'Purple Rain', colors: [{ color: '#667db6', position: 0 }, { color: '#0082c8', position: 50 }, { color: '#667db6', position: 100 }], direction: 'to-br' as const },
];

export default function EditorPage() {
  const [state, setState] = useState<EditorState>({
    screenshot: DEFAULT_SCREENSHOT,
    style: DEFAULT_STYLE,
    isLoading: false
  });

  const [history, setHistory] = useState<Array<{ config: { screenshot: ScreenshotConfig; style: StyleConfig }; timestamp: number; hasPreview?: boolean; previewUrl?: string }>>([]);
  const [activePanel, setActivePanel] = useState<'style' | 'settings' | 'presets' | 'history'>('style');
  const { toast } = useToast();
  const { processImage, fetchScreenshot } = useImageProcessor();

  // Calculate scale for mobile preview to fit in viewport
  const calculateMobileScale = () => {
    if (!state.screenshot.viewport.isMobile) return 1;
    
    // Available height: 100dvh minus header, dock, and padding
    const availableHeight = window.innerHeight - 200; // Approximate space for UI
    const imageHeight = state.screenshot.viewport.height + (state.style.margin * 2) + 
                       (state.style.browserMockup !== 'none' ? 45 : 0); // Browser frame height
    
    if (imageHeight > availableHeight) {
      return Math.min(availableHeight / imageHeight, 1);
    }
    return 1;
  };

  // Check if screenshot config has changed (requires new Microlink request)
  const screenshotConfigChanged = useCallback(() => {
    if (!state.lastScreenshotConfig || !state.baseImageUrl) return false;
    
    const current = state.screenshot;
    const last = state.lastScreenshotConfig;
    
    return (
      current.url !== last.url ||
      current.waitUntil !== last.waitUntil ||
      current.delay !== last.delay ||
      current.colorScheme !== last.colorScheme ||
      current.viewport.width !== last.viewport.width ||
      current.viewport.height !== last.viewport.height ||
      current.viewport.isMobile !== last.viewport.isMobile ||
      current.viewport.deviceScaleFactor !== last.viewport.deviceScaleFactor
    );
  }, [state.screenshot, state.lastScreenshotConfig, state.baseImageUrl]);

  // Load from localStorage on mount
  useEffect(() => {
    // Clean up old localStorage data that might have large base64 images
    try {
      const savedHistory = localStorage.getItem('snap-editor-history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        // Check if old format with previewUrl (base64 images)
        if (parsed.length > 0 && parsed[0].previewUrl && parsed[0].previewUrl.length > 10000) {
          console.log('Cleaning up old history with large images');
          localStorage.removeItem('snap-editor-history');
        } else {
          setHistory(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
      localStorage.removeItem('snap-editor-history');
    }

    const saved = localStorage.getItem('snap-editor-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading saved state:', error);
        localStorage.removeItem('snap-editor-state');
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('snap-editor-state', JSON.stringify({
      screenshot: state.screenshot,
      style: state.style
    }));
  }, [state.screenshot, state.style]);

  // Fetch initial screenshot from backend (only for URL screenshots)
  const fetchInitialScreenshot = useCallback(async () => {
    if (!state.screenshot.url) return;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const baseImageUrl = await fetchScreenshot(state.screenshot);
      
      // Process with current style
      const processedImageUrl = await processImage(baseImageUrl, state.style, state.screenshot.url);
      
      setState(prev => ({ 
        ...prev, 
        baseImageUrl,
        previewUrl: processedImageUrl,
        lastScreenshotConfig: { ...state.screenshot }, // Save config used for this screenshot
        isLoading: false 
      }));

      // Add to history
      const historyItem = {
        config: { 
          screenshot: state.screenshot,
          style: state.style
        },
        timestamp: Date.now(),
        hasPreview: true
      };

      setHistory(prev => {
        const newHistory = [historyItem, ...prev.slice(0, 9)];
        try {
          localStorage.setItem('snap-editor-history', JSON.stringify(newHistory));
        } catch (error) {
          console.warn('Failed to save history:', error);
        }
        return newHistory;
      });

    } catch (error) {
      console.error('Screenshot fetch failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch screenshot",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.screenshot, state.style, fetchScreenshot, processImage, toast]);

  // Process uploaded image or re-process existing base image with new style
  const updatePreview = useCallback(async () => {
    let sourceImageUrl: string | null = null;

    // Get source image
    if (state.uploadedImage) {
      sourceImageUrl = URL.createObjectURL(state.uploadedImage);
    } else if (state.baseImageUrl) {
      sourceImageUrl = state.baseImageUrl;
    } else {
      return;
    }

    try {
      const processedImageUrl = await processImage(sourceImageUrl, state.style, state.screenshot.url);
      setState(prev => ({ ...prev, previewUrl: processedImageUrl }));
      
      // Clean up object URL if it was created
      if (state.uploadedImage && sourceImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(sourceImageUrl);
      }
    } catch (error) {
      console.error('Preview update failed:', error);
      toast({
        title: "Error",
        description: "Failed to update preview",
        variant: "destructive"
      });
    }
  }, [state.uploadedImage, state.baseImageUrl, state.style, processImage, toast]);

  // Real-time preview updates when style changes
  useEffect(() => {
    if (state.uploadedImage || state.baseImageUrl) {
      const timer = setTimeout(() => {
        updatePreview();
      }, 300); // Faster updates for real-time feel
      return () => clearTimeout(timer);
    }
  }, [state.style, updatePreview]);

  // Process uploaded image immediately
  useEffect(() => {
    if (state.uploadedImage) {
      updatePreview();
    }
  }, [state.uploadedImage, updatePreview]);

  const dockItems: FloatingDockItem[] = [
    {
      title: "Style",
      icon: <Palette className="w-5 h-5" />,
      onClick: () => setActivePanel('style')
    },
    {
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      onClick: () => setActivePanel('settings')
    },
    {
      title: "Presets",
      icon: <Layers className="w-5 h-5" />,
      onClick: () => setActivePanel('presets')
    },
    {
      title: "History",
      icon: <History className="w-5 h-5" />,
      onClick: () => setActivePanel('history')
    },
    {
      title: "Export",
      icon: <Download className="w-5 h-5" />,
      onClick: () => {
        if (state.previewUrl) {
          const link = document.createElement('a');
          link.href = state.previewUrl;
          link.download = `screenshot-${Date.now()}.png`;
          link.click();
        }
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative">
      {/* Main Content */}
      <div className="flex h-screen">
        {/* Left Panel - Controls */}
        <div className="w-80 border-r border-gray-800/50 bg-gray-900/20 backdrop-blur-sm flex flex-col h-screen">
          <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
            <h2 className="text-xl font-semibold mb-1">Screenshot Editor</h2>
            <p className="text-sm text-gray-400">Create beautiful screenshots</p>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
            {/* URL/Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium">Website URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={state.screenshot.url}
                    onChange={(e) => {
                      const url = e.target.value;
                      setState(prev => ({
                        ...prev,
                        screenshot: { ...prev.screenshot, url }
                      }));
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && state.screenshot.url.trim()) {
                        fetchInitialScreenshot();
                      }
                    }}
                    className={`flex-1 bg-gray-800/30 border-gray-700/50 focus:border-blue-500/50 transition-colors ${
                      state.screenshot.url && !/^https?:\/\//.test(state.screenshot.url) 
                        ? 'border-red-500/50' : ''
                    }`}
                  />
                  <Button
                    onClick={fetchInitialScreenshot}
                    disabled={!state.screenshot.url.trim() || state.isLoading}
                    className={`px-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                      screenshotConfigChanged() 
                        ? 'bg-orange-600 hover:bg-orange-700 border-orange-500' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {state.isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : screenshotConfigChanged() ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {state.screenshot.url && !/^https?:\/\//.test(state.screenshot.url) && (
                  <p className="text-xs text-red-400">URL must start with http:// or https://</p>
                )}
                {state.screenshot.url && /^https?:\/\//.test(state.screenshot.url) && !screenshotConfigChanged() && (
                  <p className="text-xs text-gray-400">Press Enter or click the button to generate screenshot</p>
                )}
                {screenshotConfigChanged() && (
                  <p className="text-xs text-orange-400">Settings changed - screenshot needs to be updated</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-700/50" />
                <span className="text-xs text-gray-500 px-2">OR</span>
                <div className="flex-1 h-px bg-gray-700/50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="upload" className="text-sm font-medium">Upload Image</Label>
                <div className="relative">
                  <Input
                    id="upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setState(prev => ({ ...prev, uploadedImage: file }));
                      }
                    }}
                    className="bg-gray-800/30 border-gray-700/50 file:bg-blue-500/10 file:border-0 file:text-blue-400 file:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Panel Content */}
            <div className="min-h-[400px]">
              {activePanel === 'style' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-500" />
                    Style Options
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm">Border Radius</Label>
                      <Slider
                        value={[state.style.borderRadius]}
                        onValueChange={([value]) => setState(prev => ({
                          ...prev,
                          style: { ...prev.style, borderRadius: value }
                        }))}
                        max={50}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">{state.style.borderRadius}px</div>
                    </div>

                    <div>
                      <Label className="text-sm">Margin</Label>
                      <Slider
                        value={[state.style.margin]}
                        onValueChange={([value]) => setState(prev => ({
                          ...prev,
                          style: { ...prev.style, margin: value }
                        }))}
                        max={200}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-400 mt-1">{state.style.margin}px</div>
                    </div>

                    <div>
                      <Label className="text-sm">Browser Frame</Label>
                      <Select
                        value={state.style.browserMockup}
                        onValueChange={(value: any) => setState(prev => ({
                          ...prev,
                          style: { ...prev.style, browserMockup: value }
                        }))}
                      >
                        <SelectTrigger className="mt-2 bg-gray-800/30 border-gray-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="safari">Safari</SelectItem>
                          <SelectItem value="chrome">Chrome</SelectItem>
                          <SelectItem value="firefox">Firefox</SelectItem>
                          <SelectItem value="edge">Edge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Background Type</Label>
                      <Select
                        value={state.style.background.type}
                        onValueChange={(value: 'solid' | 'gradient') => setState(prev => ({
                          ...prev,
                          style: { 
                            ...prev.style, 
                            background: { 
                              type: value,
                              ...(value === 'solid' ? { color: '#667eea' } : {
                                direction: 'to-br' as const,
                                colors: [
                                  { color: '#667eea', position: 0 },
                                  { color: '#764ba2', position: 100 }
                                ]
                              })
                            } 
                          }
                        }))}
                      >
                        <SelectTrigger className="mt-2 bg-gray-800/30 border-gray-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="solid">Solid Color</SelectItem>
                          <SelectItem value="gradient">Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {state.style.background.type === 'solid' && (
                      <div>
                        <Label className="text-sm">Background Color</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="color"
                            value={state.style.background.color || '#667eea'}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              style: {
                                ...prev.style,
                                background: { type: 'solid', color: e.target.value }
                              }
                            }))}
                            className="bg-gray-800/30 border-gray-700/50 w-16 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={state.style.background.color || '#667eea'}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              style: {
                                ...prev.style,
                                background: { type: 'solid', color: e.target.value }
                              }
                            }))}
                            className="flex-1 bg-gray-800/30 border-gray-700/50"
                            placeholder="#667eea"
                          />
                        </div>
                      </div>
                    )}

                    {state.style.background.type === 'gradient' && (
                      <div>
                        <Label className="text-sm">Gradient Direction</Label>
                        <Select
                          value={state.style.background.direction || 'to-br'}
                          onValueChange={(value: any) => setState(prev => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              background: {
                                ...prev.style.background,
                                direction: value
                              }
                            }
                          }))}
                        >
                          <SelectTrigger className="mt-2 bg-gray-800/30 border-gray-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="to-r">Left to Right</SelectItem>
                            <SelectItem value="to-l">Right to Left</SelectItem>
                            <SelectItem value="to-t">Bottom to Top</SelectItem>
                            <SelectItem value="to-b">Top to Bottom</SelectItem>
                            <SelectItem value="to-br">Top Left to Bottom Right</SelectItem>
                            <SelectItem value="to-bl">Top Right to Bottom Left</SelectItem>
                            <SelectItem value="to-tr">Bottom Left to Top Right</SelectItem>
                            <SelectItem value="to-tl">Bottom Right to Top Left</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activePanel === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4 text-orange-500" />
                    Advanced Settings
                  </h3>

                  
                  <div className="space-y-6">
                    {/* Viewport Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Viewport</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Width</Label>
                          <Input
                            type="number"
                            value={state.screenshot.viewport.width}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              screenshot: {
                                ...prev.screenshot,
                                viewport: {
                                  ...prev.screenshot.viewport,
                                  width: parseInt(e.target.value) || 1920
                                }
                              }
                            }))}
                            className="mt-1 bg-gray-800/30 border-gray-700/50 text-sm"
                            min="320"
                            max="4096"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Height</Label>
                          <Input
                            type="number"
                            value={state.screenshot.viewport.height}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              screenshot: {
                                ...prev.screenshot,
                                viewport: {
                                  ...prev.screenshot.viewport,
                                  height: parseInt(e.target.value) || 1080
                                }
                              }
                            }))}
                            className="mt-1 bg-gray-800/30 border-gray-700/50 text-sm"
                            min="240"
                            max="4096"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={state.screenshot.viewport.isMobile}
                          onCheckedChange={(checked) => setState(prev => ({
                            ...prev,
                            screenshot: {
                              ...prev.screenshot,
                              viewport: {
                                ...prev.screenshot.viewport,
                                isMobile: checked,
                                // Set mobile defaults when toggled
                                width: checked ? 375 : 1920,
                                height: checked ? 667 : 1080,
                                deviceScaleFactor: checked ? 2 : 1
                              }
                            }
                          }))}
                        />
                        <Label className="text-sm">Mobile Device</Label>
                      </div>

                      <div>
                        <Label className="text-sm">Device Scale Factor</Label>
                        <Slider
                          value={[state.screenshot.viewport.deviceScaleFactor]}
                          onValueChange={([value]) => setState(prev => ({
                            ...prev,
                            screenshot: {
                              ...prev.screenshot,
                              viewport: {
                                ...prev.screenshot.viewport,
                                deviceScaleFactor: value
                              }
                            }
                          }))}
                          min={0.5}
                          max={3}
                          step={0.1}
                          className="mt-2"
                        />
                        <div className="text-xs text-gray-400 mt-1">{state.screenshot.viewport.deviceScaleFactor}x</div>
                      </div>
                    </div>

                    {/* Screenshot Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-300">Capture Settings</h4>
                      
                      <div>
                        <Label className="text-sm">Wait Until</Label>
                        <Select
                          value={state.screenshot.waitUntil}
                          onValueChange={(value: any) => setState(prev => ({
                            ...prev,
                            screenshot: { ...prev.screenshot, waitUntil: value }
                          }))}
                        >
                          <SelectTrigger className="mt-2 bg-gray-800/30 border-gray-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="load">Load Event</SelectItem>
                            <SelectItem value="domcontentloaded">DOM Content Loaded</SelectItem>
                            <SelectItem value="networkidle0">Network Idle (0ms)</SelectItem>
                            <SelectItem value="networkidle2">Network Idle (2s)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm">Delay (ms)</Label>
                        <Slider
                          value={[state.screenshot.delay]}
                          onValueChange={([value]) => setState(prev => ({
                            ...prev,
                            screenshot: { ...prev.screenshot, delay: value }
                          }))}
                          min={0}
                          max={10000}
                          step={100}
                          className="mt-2"
                        />
                        <div className="text-xs text-gray-400 mt-1">{state.screenshot.delay}ms</div>
                      </div>

                      <div>
                        <Label className="text-sm">Color Scheme</Label>
                        <Select
                          value={state.screenshot.colorScheme}
                          onValueChange={(value: 'light' | 'dark') => setState(prev => ({
                            ...prev,
                            screenshot: { ...prev.screenshot, colorScheme: value }
                          }))}
                        >
                          <SelectTrigger className="mt-2 bg-gray-800/30 border-gray-700/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700">
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Shadow Settings */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-300">Shadow</h4>
                        <Switch
                          checked={state.style.shadow.enabled}
                          onCheckedChange={(checked) => setState(prev => ({
                            ...prev,
                            style: {
                              ...prev.style,
                              shadow: { ...prev.style.shadow, enabled: checked }
                            }
                          }))}
                        />
                      </div>

                      {state.style.shadow.enabled && (
                        <div className="space-y-3">
                          <div>
                            <Label className="text-xs">Blur</Label>
                            <Slider
                              value={[state.style.shadow.blur]}
                              onValueChange={([value]) => setState(prev => ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  shadow: { ...prev.style.shadow, blur: value }
                                }
                              }))}
                              max={50}
                              step={1}
                              className="mt-1"
                            />
                            <div className="text-xs text-gray-400">{state.style.shadow.blur}px</div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-xs">Offset X</Label>
                              <Slider
                                value={[state.style.shadow.offsetX]}
                                onValueChange={([value]) => setState(prev => ({
                                  ...prev,
                                  style: {
                                    ...prev.style,
                                    shadow: { ...prev.style.shadow, offsetX: value }
                                  }
                                }))}
                                min={-50}
                                max={50}
                                step={1}
                                className="mt-1"
                              />
                              <div className="text-xs text-gray-400">{state.style.shadow.offsetX}px</div>
                            </div>

                            <div>
                              <Label className="text-xs">Offset Y</Label>
                              <Slider
                                value={[state.style.shadow.offsetY]}
                                onValueChange={([value]) => setState(prev => ({
                                  ...prev,
                                  style: {
                                    ...prev.style,
                                    shadow: { ...prev.style.shadow, offsetY: value }
                                  }
                                }))}
                                min={-50}
                                max={50}
                                step={1}
                                className="mt-1"
                              />
                              <div className="text-xs text-gray-400">{state.style.shadow.offsetY}px</div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-xs">Opacity</Label>
                            <Slider
                              value={[state.style.shadow.opacity]}
                              onValueChange={([value]) => setState(prev => ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  shadow: { ...prev.style.shadow, opacity: value }
                                }
                              }))}
                              min={0}
                              max={1}
                              step={0.01}
                              className="mt-1"
                            />
                            <div className="text-xs text-gray-400">{Math.round(state.style.shadow.opacity * 100)}%</div>
                          </div>

                          <div>
                            <Label className="text-xs">Color</Label>
                            <Input
                              type="color"
                              value={state.style.shadow.color}
                              onChange={(e) => setState(prev => ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  shadow: { ...prev.style.shadow, color: e.target.value }
                                }
                              }))}
                              className="mt-1 bg-gray-800/30 border-gray-700/50 h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'presets' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-500" />
                    Preset Gradients
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PRESET_GRADIENTS.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => setState(prev => ({
                          ...prev,
                          style: {
                            ...prev.style,
                            background: {
                              type: 'gradient',
                              direction: preset.direction,
                              colors: preset.colors
                            }
                          }
                        }))}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-colors text-left"
                      >
                        <div 
                          className="w-8 h-8 rounded-md"
                          style={{
                            background: `linear-gradient(${preset.direction.replace('to-', 'to ')}, ${preset.colors.map(c => `${c.color} ${c.position || 0}%`).join(', ')})`
                          }}
                        />
                        <span className="text-sm">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activePanel === 'history' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <History className="w-4 h-4 text-green-500" />
                    Recent Screenshots
                  </h3>
                  {history.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No screenshots yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setState(prev => ({ 
                            ...prev, 
                            screenshot: item.config.screenshot,
                            style: item.config.style
                          }))}
                          className="w-full p-3 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-gray-600/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-gray-700/50 flex items-center justify-center">
                              {item.hasPreview ? (
                                <Eye className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">
                                {item.config.screenshot?.url || 'Uploaded Image'}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(item.timestamp).toLocaleString()}
                              </p>
                              <div className="flex gap-1 mt-1">
                                {item.config.style?.background.type === 'gradient' && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0">Gradient</Badge>
                                )}
                                {item.config.style?.browserMockup !== 'none' && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0">{item.config.style.browserMockup}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative max-w-4xl w-full">
              {state.isLoading ? (
                <div className="flex flex-col items-center justify-center h-96 border border-gray-800/50 rounded-2xl bg-gray-900/10">
                  <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-400">Generating screenshot...</p>
                </div>
              ) : state.previewUrl ? (
                <div className="relative flex justify-center">
                  <div
                    className="relative"
                    style={{
                      transform: `scale(${calculateMobileScale()})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.3s ease-in-out'
                    }}
                  >
                    <img 
                      src={state.previewUrl} 
                      alt="Preview" 
                      className="rounded-2xl shadow-2xl"
                      style={{
                        maxWidth: state.screenshot.viewport.isMobile ? 'none' : '100%',
                        width: state.screenshot.viewport.isMobile ? 'auto' : '100%'
                      }}
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <Eye className="w-3 h-3 mr-1" />
                        {state.screenshot.viewport.isMobile && calculateMobileScale() < 1 
                          ? `Mobile (${Math.round(calculateMobileScale() * 100)}%)`
                          : 'Live Preview'
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-96 border border-dashed border-gray-700/50 rounded-2xl">
                  <ImageIcon className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Ready to create</p>
                  <p className="text-gray-500 text-sm">Enter a URL or upload an image to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {screenshotConfigChanged() && (
        <div className="fixed bottom-36 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-gray-900/95 backdrop-blur-md border border-orange-500/30 rounded-2xl px-4 py-3 shadow-2xl max-w-sm">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-orange-300 truncate">Settings changed</p>
                <p className="text-xs text-orange-400/80">Screenshot needs updating</p>
              </div>
              <Button 
                onClick={fetchInitialScreenshot}
                disabled={state.isLoading}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 h-7 text-xs flex-shrink-0"
              >
                {state.isLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Dock */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} />
      </div>
    </div>
  );
}