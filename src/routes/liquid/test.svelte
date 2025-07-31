<script lang="ts">
	import { LiquidGlass, type GlassStyle } from '$lib';

	interface LiquidGlassInstance {
		updateScreenshot: () => Promise<void>;
		forceUpdate: () => Promise<void>;
		updateGlassStyle: (style: Partial<GlassStyle>) => void;
		getGlassStyle: () => Required<GlassStyle>;
		getElement: () => HTMLElement | null;
		getContent: () => HTMLDivElement | null;
	}

	let glassRef: LiquidGlassInstance | null = null;

	// Example glass style configurations
	const defaultStyle = {
		depth: 24,
		segments: 86,
		radius: 16,
		tint: null,
		roughness: 0.3,
		transmission: 1,
		reflectivity: 0.9,
		ior: 2,
		thickness: 32,
		dispersion: 10
	};

	const modernStyle = {
		depth: 12,
		segments: 64,
		radius: 20,
		tint: null,
		roughness: 0.1,
		transmission: 0.95,
		reflectivity: 0.8,
		ior: 1.5,
		thickness: 16,
		dispersion: 5
	};

	let currentGlassStyle = $state(defaultStyle);
	let useModernStyle = $state(false);

	$effect(() => {
		currentGlassStyle = useModernStyle ? modernStyle : defaultStyle;
	});

	function handleReady(instance: LiquidGlassInstance) {
		glassRef = instance;
		console.log('LiquidGlass ready:', instance);
	}

	function updateScreenshot() {
		glassRef?.updateScreenshot();
	}

	function randomizeStyle() {
		if (glassRef) {
			const randomStyle = {
				depth: Math.random() * 40 + 10,
				segments: Math.floor(Math.random() * 50) + 32,
				radius: Math.random() * 30 + 5,
				roughness: Math.random() * 0.5,
				transmission: 0.7 + Math.random() * 0.3,
				reflectivity: 0.5 + Math.random() * 0.5,
				ior: 1.2 + Math.random() * 1.3,
				thickness: Math.random() * 50 + 10,
				dispersion: Math.random() * 15
			};
			glassRef.updateGlassStyle(randomStyle);
		}
	}
</script>

<svelte:head>
	<title>Liquid Glass Demo</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-8">
	<!-- Background content -->
	<div class="mx-auto max-w-4xl space-y-8">
		<h1 class="mb-8 text-center text-4xl font-bold text-white">Liquid Glass Effect Demo</h1>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div class="rounded-lg bg-white/10 p-6 text-white backdrop-blur-sm">
				<h2 class="mb-4 text-2xl font-semibold">Background Content</h2>
				<p class="mb-4">
					This is the background content that will be captured and displayed behind the liquid glass
					effect. The glass creates a beautiful distortion and refraction of this content.
				</p>
				<div class="mb-4 h-32 w-full rounded-lg bg-gradient-to-r from-yellow-400 to-red-500"></div>
				<p>
					The liquid glass component uses Three.js and WebGL to create realistic glass materials
					with proper light transmission, refraction, and dispersion.
				</p>
			</div>

			<div class="rounded-lg bg-white/10 p-6 text-white backdrop-blur-sm">
				<h2 class="mb-4 text-2xl font-semibold">More Background</h2>
				<div class="space-y-4">
					<div class="h-4 w-full rounded bg-blue-400"></div>
					<div class="h-4 w-3/4 rounded bg-green-400"></div>
					<div class="h-4 w-1/2 rounded bg-purple-400"></div>
					<div class="h-4 w-full rounded bg-pink-400"></div>
				</div>
				<p class="mt-4">
					Background elements are captured in real-time and used as textures for the glass
					background, creating an authentic glass effect.
				</p>
			</div>
		</div>

		<!-- Glass Components -->
		<div class="flex flex-wrap items-center justify-center gap-6">
			<!-- Main Glass Card -->
			<LiquidGlass
				glassStyle={currentGlassStyle}
				wrapperStyle="padding: 2rem; width: fit-content; margin: 0 auto;"
				onReady={handleReady}
			>
				<div class="text-center">
					<h3 class="mb-4 text-xl font-bold text-white">Liquid Glass</h3>
					<p class="mb-4 text-white/90">
						A beautiful glass effect created with Svelte 5 and Threlte
					</p>
					<div class="flex flex-wrap justify-center gap-2">
						<button
							class="rounded-lg bg-white/20 px-4 py-2 text-white transition-colors hover:bg-white/30"
							onclick={updateScreenshot}
						>
							Update Screenshot
						</button>
						<button
							class="rounded-lg bg-white/20 px-4 py-2 text-white transition-colors hover:bg-white/30"
							onclick={randomizeStyle}
						>
							Randomize Style
						</button>
					</div>
				</div>
			</LiquidGlass>

			<!-- Style Toggle -->
			<LiquidGlass
				glassStyle={{ ...currentGlassStyle, radius: 25 }}
				wrapperStyle="padding: 1rem; width: fit-content;"
			>
				<div class="text-center">
					<label class="flex items-center space-x-2 text-white">
						<input type="checkbox" bind:checked={useModernStyle} class="h-4 w-4" />
						<span>Modern Style</span>
					</label>
				</div>
			</LiquidGlass>

			<!-- Circular Glass -->
			<LiquidGlass
				glassStyle={{
					...currentGlassStyle,
					radius: 50,
					depth: 16
				}}
				wrapperStyle="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center;"
			>
				<div class="text-center">
					<span class="text-2xl">🔮</span>
				</div>
			</LiquidGlass>
		</div>

		<!-- Controls -->
		<div class="rounded-lg bg-white/10 p-6 text-white backdrop-blur-sm">
			<h3 class="mb-4 text-lg font-semibold">Glass Style Controls</h3>
			<div class="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
				<div>
					<strong>Depth:</strong>
					{currentGlassStyle.depth.toFixed(1)}
				</div>
				<div>
					<strong>Segments:</strong>
					{currentGlassStyle.segments}
				</div>
				<div>
					<strong>Radius:</strong>
					{currentGlassStyle.radius.toFixed(1)}
				</div>
				<div>
					<strong>Roughness:</strong>
					{currentGlassStyle.roughness.toFixed(2)}
				</div>
				<div>
					<strong>Transmission:</strong>
					{currentGlassStyle.transmission.toFixed(2)}
				</div>
				<div>
					<strong>Reflectivity:</strong>
					{currentGlassStyle.reflectivity.toFixed(2)}
				</div>
				<div>
					<strong>IOR:</strong>
					{currentGlassStyle.ior.toFixed(1)}
				</div>
				<div>
					<strong>Dispersion:</strong>
					{currentGlassStyle.dispersion.toFixed(1)}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
