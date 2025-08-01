<script lang="ts">
	import LiquidGlass from '$lib/components/ui/ReactGlass/LiquidGlass.svelte';
	import type { GlassStyle } from '$lib/components/ui/ReactGlass/types';

	// Glass style state
	let segments = 64;
	let radius = 16;
	let tint: number | null = null;
	let roughness = 0.2;
	let transmission = 1;
	let reflectivity = 0.9;
	let ior = 2;
	let thickness = 32;
	let dispersion = 5;
	let useTint = false;

	// Component reference for accessing methods
	let liquidGlassRef: any = null;

	// Reactive glass style object
	$: glassStyle = {
		depth: radius,
		segments,
		radius,
		tint: useTint ? tint : null,
		roughness,
		transmission,
		reflectivity,
		ior,
		thickness,
		dispersion,
	} as GlassStyle;

	// Reset to defaults
	const resetToDefaults = () => {
		segments = 64;
		radius = 16;
		tint = 0xff0000; // Red tint for demo
		useTint = false;
		roughness = 0.2;
		transmission = 1;
		reflectivity = 0.9;
		ior = 2;
		thickness = 32;
		dispersion = 5;
	};

	// Update screenshot
	const updateScreenshot = async () => {
		if (liquidGlassRef) {
			await liquidGlassRef.updateScreenshot();
		}
	};

	// Force update
	const forceUpdate = async () => {
		if (liquidGlassRef) {
			await liquidGlassRef.forceUpdate();
		}
	};
</script>

<div class="demo-container">
	<h1>Liquid Glass Svelte Demo</h1>
	
	<!-- Background content for glass effect -->
	<div class="background-content">
		<div class="gradient-bg"></div>
		<div class="content-grid">
			<div class="card">
				<h3>Card 1</h3>
				<p>Some background content that will be visible through the glass effect.</p>
			</div>
			<div class="card">
				<h3>Card 2</h3>
				<p>More content to demonstrate the glass background capture.</p>
			</div>
			<div class="card">
				<h3>Card 3</h3>
				<p>This content creates the visual backdrop for the glass effect.</p>
			</div>
		</div>
	</div>

	<!-- Controls Panel -->
	<div class="controls-panel">
		<h2>Glass Controls</h2>
		
		<div class="control-group">
			<button on:click={resetToDefaults} class="btn btn-primary">
				Reset to Defaults
			</button>
			<button on:click={updateScreenshot} class="btn btn-secondary">
				Update Screenshot
			</button>
			<button on:click={forceUpdate} class="btn btn-secondary">
				Force Update
			</button>
		</div>

		<div class="sliders">
			<div class="slider-group">
				<label for="segments">Segments: {segments}</label>
				<input
					id="segments"
					type="range"
					min="8"
					max="128"
					step="8"
					bind:value={segments}
				/>
				<small>Number of geometry segments for smoothness</small>
			</div>

			<div class="slider-group">
				<label for="radius">Radius: {radius}</label>
				<input
					id="radius"
					type="range"
					min="4"
					max="40"
					step="2"
					bind:value={radius}
				/>
				<small>Border radius and depth of the glass shape</small>
			</div>

			<div class="slider-group">
				<label for="roughness">Roughness: {roughness}</label>
				<input
					id="roughness"
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={roughness}
				/>
				<small>Surface roughness (0 = mirror-like, 1 = completely rough)</small>
			</div>

			<div class="slider-group">
				<label for="transmission">Transmission: {transmission}</label>
				<input
					id="transmission"
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={transmission}
				/>
				<small>Light transmission (0 = opaque, 1 = fully transparent)</small>
			</div>

			<div class="slider-group">
				<label for="reflectivity">Reflectivity: {reflectivity}</label>
				<input
					id="reflectivity"
					type="range"
					min="0"
					max="1"
					step="0.01"
					bind:value={reflectivity}
				/>
				<small>How reflective the surface is</small>
			</div>

			<div class="slider-group">
				<label for="ior">Index of Refraction: {ior}</label>
				<input
					id="ior"
					type="range"
					min="1"
					max="3"
					step="0.01"
					bind:value={ior}
				/>
				<small>Controls light bending (1 = no bending, 2.4 = diamond-like)</small>
			</div>

			<div class="slider-group">
				<label for="thickness">Thickness: {thickness}</label>
				<input
					id="thickness"
					type="range"
					min="1"
					max="100"
					step="1"
					bind:value={thickness}
				/>
				<small>Physical thickness of the glass material</small>
			</div>

			<div class="slider-group">
				<label for="dispersion">Chromatic Dispersion: {dispersion}</label>
				<input
					id="dispersion"
					type="range"
					min="0"
					max="20"
					step="0.1"
					bind:value={dispersion}
				/>
				<small>Rainbow effect like a prism</small>
			</div>

			<div class="slider-group">
				<div class="checkbox-group">
					<input
						id="useTint"
						type="checkbox"
						bind:checked={useTint}
					/>
					<label for="useTint">Use Color Tint</label>
				</div>
				{#if useTint}
					<input
						type="color"
						bind:value={tint}
						style="width: 100%; height: 40px; margin-top: 0.5rem;"
					/>
				{/if}
				<small>Color tint applied to the glass material</small>
			</div>
		</div>

		<!-- Code example -->
		<div class="code-example">
			<h3>Current Configuration</h3>
			<pre><code>{`import LiquidGlass from '$lib/components/ui/ReactGlass/LiquidGlass.svelte';

const glassStyle = {
  depth: ${radius},
  segments: ${segments},
  radius: ${radius},
  tint: ${useTint ? `0x${tint?.toString(16).padStart(6, '0')}` : 'null'},
  roughness: ${roughness},
  transmission: ${transmission},
  reflectivity: ${reflectivity},
  ior: ${ior},
  thickness: ${thickness},
  dispersion: ${dispersion},
};

<LiquidGlass {glassStyle} bind:this={liquidGlassRef}>
  <div class="glass-content">
    <h2>Liquid Glass Effect</h2>
    <p>Content inside the glass!</p>
  </div>
</LiquidGlass>`}</code></pre>
		</div>
	</div>

	<!-- Glass Demo -->
	<div class="glass-demo">
		<LiquidGlass 
			{glassStyle}
			style="padding: 2rem; border-radius: {radius}px;"
			wrapperStyle="position: fixed; bottom: 2rem; right: 2rem; z-index: 1000; max-width: 300px;"
			bind:this={liquidGlassRef}
		>
			<div class="glass-content">
				<h2>🌟 Liquid Glass</h2>
				<p>This content is rendered inside the glass effect with a beautiful backdrop blur.</p>
				<div class="glass-stats">
					<div>Segments: {segments}</div>
					<div>Radius: {radius}px</div>
					<div>Roughness: {roughness}</div>
					<div>Transmission: {transmission}</div>
				</div>
			</div>
		</LiquidGlass>
	</div>
</div>

<style>
	.demo-container {
		min-height: 100vh;
		position: relative;
		font-family: system-ui, -apple-system, sans-serif;
	}

	.background-content {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}

	.gradient-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
	}

	.content-grid {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		padding: 2rem;
	}

	.card {
		background: rgba(255, 255, 255, 0.1);
		padding: 2rem;
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
	}

	.controls-panel {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 1rem;
		margin: 2rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		max-width: 500px;
	}

	.control-group {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
	}

	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #667eea;
		color: white;
	}

	.btn-primary:hover {
		background: #5a6fd8;
	}

	.btn-secondary {
		background: #f1f3f4;
		color: #333;
	}

	.btn-secondary:hover {
		background: #e8eaed;
	}

	.sliders {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.slider-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.slider-group label {
		font-weight: 600;
		color: #333;
	}

	.slider-group input[type="range"] {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: #ddd;
		outline: none;
		-webkit-appearance: none;
	}

	.slider-group input[type="range"]::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
	}

	.slider-group small {
		color: #666;
		font-size: 0.875rem;
	}

	.checkbox-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.code-example {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 0.5rem;
		border: 1px solid #e9ecef;
	}

	.code-example h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		color: #333;
	}

	.code-example pre {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.5;
		overflow-x: auto;
	}

	.code-example code {
		color: #333;
	}

	.glass-content {
		color: white;
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
	}

	.glass-content h2 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.glass-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.5rem;
		margin-top: 1rem;
		font-size: 0.875rem;
		font-family: monospace;
		background: rgba(0, 0, 0, 0.2);
		padding: 0.75rem;
		border-radius: 0.25rem;
	}

	@media (max-width: 768px) {
		.controls-panel {
			margin: 1rem;
			padding: 1.5rem;
		}

		.content-grid {
			grid-template-columns: 1fr;
			padding: 1rem;
		}

		.glass-demo :global(.glass-wrapper) {
			position: fixed !important;
			bottom: 1rem !important;
			right: 1rem !important;
			left: 1rem !important;
			max-width: none !important;
		}
	}
</style>
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
