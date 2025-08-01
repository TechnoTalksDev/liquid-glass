import html2canvaspro, { type Options as Html2CanvasProOptions } from 'html2canvas-pro';
import html2canvas, { type Options as Html2CanvasOptions } from 'html2canvas';

const DEBOUNCE_DELAY = 16;

// Common options that work with both libraries
interface CommonOptions {
    allowTaint?: boolean;
    useCORS?: boolean;
    scale?: number;
    backgroundColor?: string | null;
    removeContainer?: boolean;
}

interface ScreenshotCache {
    element: HTMLElement;
    canvas: HTMLCanvasElement;
    timestamp: number;
    callbacks: Set<(canvas: HTMLCanvasElement) => void>;
}

export class PaintLayerCache {
    private static instance: PaintLayerCache | null = null;
    private static useHtml2CanvasProFlag = false;
    private cache = new Map<HTMLElement, ScreenshotCache>();
    private debounceTimers = new Map<HTMLElement, number>();

    private constructor() {}

    static getInstance(): PaintLayerCache {
        if (!PaintLayerCache.instance) {
            PaintLayerCache.instance = new PaintLayerCache();
        }
        return PaintLayerCache.instance;
    }

    static useHtml2CanvasPro(enable: boolean): void {
        PaintLayerCache.useHtml2CanvasProFlag = enable;
    }

    async register(
        element: HTMLElement,
        callback: (canvas: HTMLCanvasElement) => void
    ): Promise<void> {
        let cache = this.cache.get(element);
        
        if (!cache) {
            // Create new cache entry
            const canvas = await this.takeElementScreenshot(element);
            cache = {
                element,
                canvas,
                timestamp: Date.now(),
                callbacks: new Set([callback])
            };
            this.cache.set(element, cache);
            
            // Set up mutation observer for this element
            this.setupObserver(element);
        } else {
            // Add callback to existing cache
            cache.callbacks.add(callback);
        }
        
        // Call the callback with current canvas
        callback(cache.canvas);
    }

    unregister(
        element: HTMLElement,
        callback: (canvas: HTMLCanvasElement) => void
    ): void {
        const cache = this.cache.get(element);
        if (cache) {
            cache.callbacks.delete(callback);
            
            // If no more callbacks, remove from cache
            if (cache.callbacks.size === 0) {
                this.cache.delete(element);
                // Clean up debounce timer if exists
                const timer = this.debounceTimers.get(element);
                if (timer) {
                    clearTimeout(timer);
                    this.debounceTimers.delete(element);
                }
            }
        }
    }

    async forceUpdate(element: HTMLElement): Promise<void> {
        const cache = this.cache.get(element);
        if (cache) {
            const newCanvas = await this.takeElementScreenshot(element);
            cache.canvas = newCanvas;
            cache.timestamp = Date.now();
            
            // Notify all callbacks
            cache.callbacks.forEach(callback => {
                callback(newCanvas);
            });
        }
    }

    private setupObserver(element: HTMLElement): void {
        // For now, we'll rely on manual updates
        // In a more complete implementation, you could add ResizeObserver
        // or MutationObserver to detect changes automatically
    }

    private debouncedUpdate(element: HTMLElement): void {
        // Clear existing timer
        const existingTimer = this.debounceTimers.get(element);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }

        // Set new timer
        const timer = window.setTimeout(() => {
            this.forceUpdate(element);
            this.debounceTimers.delete(element);
        }, DEBOUNCE_DELAY);

        this.debounceTimers.set(element, timer);
    }

    private async takeElementScreenshot(
        element: HTMLElement,
        options: Partial<CommonOptions> = {}
    ): Promise<HTMLCanvasElement> {
        const defaultOptions: Partial<CommonOptions> = {
            allowTaint: true,
            useCORS: true,
            scale: 1,
            backgroundColor: null,
            removeContainer: true,
            ...options
        };

        try {
            // Try html2canvas-pro first if enabled
            if (PaintLayerCache.useHtml2CanvasProFlag) {
                return await html2canvaspro(element, defaultOptions as Partial<Html2CanvasProOptions>);
            }
            
            // Fallback to regular html2canvas
            return await html2canvas(element, defaultOptions as Partial<Html2CanvasOptions>);
        } catch (error) {
            console.warn('html2canvas-pro failed, falling back to html2canvas:', error);
            
            // Fallback to regular html2canvas
            try {
                return await html2canvas(element, defaultOptions as Partial<Html2CanvasOptions>);
            } catch (fallbackError) {
                console.error('Both html2canvas implementations failed:', fallbackError);
                throw fallbackError;
            }
        }
    }
}

export async function takeElementScreenshot(
    element: HTMLElement,
    options: Partial<CommonOptions> = {}
): Promise<HTMLCanvasElement> {
    const cache = PaintLayerCache.getInstance();
    return cache['takeElementScreenshot'](element, options);
}
