<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { Canvas } from '@threlte/core';
import html2canvas from 'html2canvas';
import LiquidGlassScene from './LiquidGlassScene.svelte';

// TypeScript interfaces
interface GlassStyle {
  depth?: number;
  segments?: number;
  radius?: number;
  tint?: number | null;
  roughness?: number;
  transmission?: number;
  reflectivity?: number;
  ior?: number;
  dispersion?: number;
  thickness?: number;
}

interface LiquidGlassInstance {
  updateScreenshot: () => Promise<void>;
  forceUpdate: () => Promise<void>;
  updateGlassStyle: (style: Partial<GlassStyle>) => void;
  getGlassStyle: () => Required<GlassStyle>;
  getElement: () => HTMLElement | null;
  getContent: () => HTMLDivElement | null;
}

// Props interface
interface Props {
  children?: import('svelte').Snippet;
  style?: string;
  wrapperStyle?: string;
  glassStyle?: GlassStyle;
  targetElement?: HTMLElement;
  onReady?: (instance: LiquidGlassInstance) => void;
}

const {
  children,
  style = '',
  wrapperStyle = '',
  glassStyle = {},
  targetElement,
  onReady
}: Props = $props();

// Default glass style
const DEFAULT_GLASS_STYLE: Required<GlassStyle> = {
  depth: 24,
  segments: 86,
  radius: 16,
  tint: null,
  roughness: 0.3,
  transmission: 1,
  reflectivity: 0.9,
  ior: 2,
  thickness: 32,
  dispersion: 10,
};

// Internal state
let containerElement = $state<HTMLDivElement | null>(null);
let contentElement = $state<HTMLDivElement | null>(null);
let canvasElement: HTMLCanvasElement;
let resizeObserver: ResizeObserver;
let backgroundTexture = $state<HTMLCanvasElement | null>(null);
let isInitialized = $state(false);
let currentGlassStyle = $state({ ...DEFAULT_GLASS_STYLE, ...glassStyle });
let dimensions = $state({ width: 1, height: 1 });
let glassPosition = $state({ x: 0, y: 0 });

// Screenshot capture utilities
let captureTarget = $state<HTMLElement | null>(null);

onMount(() => {
  captureTarget = targetElement || document.body;
  
  // Setup resize observer - wait for containerElement to be bound
  setTimeout(() => {
    if (containerElement) {
      // Setup resize observer with debouncing
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateDimensions();
        }, 100); // Debounce resize updates
      });
      
      resizeObserver.observe(containerElement);
      updateDimensions();
      initializeScreenshotCapture();
      isInitialized = true;
      
      // Create instance for ref-like functionality
      const instance: LiquidGlassInstance = {
        updateScreenshot: async () => {
          await captureScreenshot();
        },
        forceUpdate: async () => {
          await captureScreenshot();
        },
        updateGlassStyle: (newStyle: Partial<GlassStyle>) => {
          currentGlassStyle = { ...currentGlassStyle, ...newStyle };
        },
        getGlassStyle: () => ({ ...currentGlassStyle }),
        getElement: () => containerElement || null,
        getContent: () => contentElement || null,
      };
      
      onReady?.(instance);
    }
  }, 0);
});

onDestroy(() => {
  resizeObserver?.disconnect();
  isCapturing = false;
  // Clean up any timeout references
  clearTimeout(resizeTimeout);
});

function updateDimensions() {
  if (containerElement) {
    const rect = containerElement.getBoundingClientRect();
    dimensions = {
      width: rect.width || 1,
      height: rect.height || 1
    };
    updateGlassPosition();
  }
}

function updateGlassPosition() {
  if (!containerElement || !captureTarget || !isInitialized) {
    glassPosition = { x: 0, y: 0 };
    return;
  }
  
  try {
    const containerRect = containerElement.getBoundingClientRect();
    const targetRect = captureTarget.getBoundingClientRect();
    
    const containerCenter = {
      x: containerRect.left + containerRect.width / 2,
      y: containerRect.top + containerRect.height / 2,
    };
    
    const relativePosition = {
      x: containerCenter.x - targetRect.left,
      y: containerCenter.y - targetRect.top,
    };
    
    glassPosition = {
      x: relativePosition.x - targetRect.width / 2,
      y: relativePosition.y - targetRect.height / 2,
    };
  } catch (error) {
    glassPosition = { x: 0, y: 0 };
  }
}

async function initializeScreenshotCapture() {
  // Only capture once during initialization
  if (!backgroundTexture) {
    await captureScreenshot();
  }
}

let resizeTimeout: number;
let isCapturing = false;
async function captureScreenshot() {
  if (!captureTarget || isCapturing) return;
  
  isCapturing = true;
  try {
    // Use html2canvas to capture the background element
    const canvas = await html2canvas(captureTarget, {
      allowTaint: true,
      useCORS: true,
      scale: Math.min(window.devicePixelRatio, 2), // Limit scale for performance
      logging: false,
      width: Math.min(captureTarget.scrollWidth, 1920), // Limit size for performance
      height: Math.min(captureTarget.scrollHeight, 1080),
      ignoreElements: (element) => {
        // Ignore elements with data-html2canvas-ignore attribute
        return element.hasAttribute('data-html2canvas-ignore');
      }
    });

    backgroundTexture = canvas;
  } catch (error) {
    console.error('Failed to capture screenshot:', error);
    
    // Fallback to simple gradient background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetRect = captureTarget.getBoundingClientRect();
    canvas.width = Math.min(targetRect.width, 1920);
    canvas.height = Math.min(targetRect.height, 1080);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(100, 100, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 100, 100, 0.1)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    backgroundTexture = canvas;
  } finally {
    isCapturing = false;
  }
}

// Calculate border radius based on glass style
const borderRadius = $derived(`${currentGlassStyle.radius * 2}px`);
</script>

<div
  bind:this={containerElement}
  class="liquid-glass-container"
  style:border-radius={borderRadius}
  style:position="relative"
  style:overflow="hidden"
  style={wrapperStyle}
  data-html2canvas-ignore="true"
>
  <!-- Content layer -->
  <div
    bind:this={contentElement}
    class="liquid-glass-content"
    style:position="relative"
    style:z-index="1"
    style={style}
  >
    {#if children}
      {@render children()}
    {/if}
  </div>

  <!-- Three.js Canvas with glass effect -->
  {#if isInitialized}
    <div
      class="liquid-glass-canvas"
      style:position="absolute"
      style:top="0"
      style:left="0"
      style:width="100%"
      style:height="100%"
      style:pointer-events="none"
    >
      <Canvas>
        <LiquidGlassScene 
          {dimensions}
          {currentGlassStyle}
          {backgroundTexture}
          {glassPosition}
        />
      </Canvas>
    </div>
  {/if}
</div>

<style>
.liquid-glass-container {
  position: relative;
  overflow: hidden;
}

.liquid-glass-content {
  position: relative;
  z-index: 1;
}

.liquid-glass-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
