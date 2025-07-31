// place files you want to import through the `$lib` alias in this folder.

export { default as LiquidGlass } from './components/ui/LiquidGlass.svelte';
export { default as LiquidGlassScene } from './components/ui/LiquidGlassScene.svelte';
export { default as PillGeometry } from './components/ui/PillGeometry';

// Glass style interface
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
