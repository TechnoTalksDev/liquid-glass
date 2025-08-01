import type { LiquidGlass } from './LiquidGlass';

export interface GlassStyle {
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

export interface Dimensions {
    width: number;
    height: number;
}

export interface ScrollbarSizes {
    x: number;
    y: number;
}

export interface LiquidGlassProps {
    /**
     * Custom CSS styles to apply to the glass container
     */
    style?: string;
    /**
     * CSS styles to apply to the wrapper div
     */
    wrapperStyle?: string;
    /**
     * Glass material properties
     */
    glassStyle?: GlassStyle;
    /**
     * The target element to capture for the glass background effect.
     * If not provided, document.body will be used.
     */
    targetElement?: HTMLElement;
    /**
     * Optional key to force re-rendering of the component
     * Useful for cases where you want to reset the component state
     */
    renderKey?: string | number;
}

export interface LiquidGlassRef {
    getInstance(): LiquidGlass | null;
    updateScreenshot(): Promise<void>;
    forceUpdate(): Promise<void>;
    updateGlassStyle(style: Partial<GlassStyle>): void;
    getGlassStyle(): Required<GlassStyle> | null;
    getElement(): HTMLElement | null;
    getContent(): HTMLDivElement | null;
    forcePositionUpdate(): void;
    forceSizeUpdate(): void;
}
