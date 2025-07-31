<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/three/Scene.svelte';
	import { LiquidGlass } from '$lib';

	let useVideoBg = $state(false);
	const YOUTUBE_ID = 'G5RpJwCJDqc';

	// Glass style configurations
	const glassStyles = {
		modern: {
			depth: 12,
			segments: 64,
			radius: 20,
			roughness: 0.1,
			transmission: 0.95,
			reflectivity: 0.8,
			ior: 1.5,
			thickness: 16,
			dispersion: 5
		},
		classic: {
			depth: 24,
			segments: 86,
			radius: 16,
			roughness: 0.3,
			transmission: 1,
			reflectivity: 0.9,
			ior: 2,
			thickness: 32,
			dispersion: 10
		}
	};

	let currentStyle = $state(glassStyles.modern);
	let useClassicStyle = $state(false);

	$effect(() => {
		currentStyle = useClassicStyle ? glassStyles.classic : glassStyles.modern;
	});
</script>

<div
	class="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
	style="background-image: {useVideoBg ? 'none' : `url('/wallpaper.jpg')`}"
>
	{#if useVideoBg}
		<div style="position:fixed; inset:0; z-index:-1; pointer-events:none;">
			<iframe
				title="background-video"
				width="100%"
				height="100%"
				src="https://www.youtube.com/embed/{YOUTUBE_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist={YOUTUBE_ID}&vq=hd2160"
				frameborder="0"
				allow="autoplay; encrypted-media"
				allowfullscreen
				style="width:100vw; height:100vh; object-fit:cover; pointer-events:none;"
			></iframe>
		</div>
	{/if}

	<!-- 3D Scene with Threlte -->
	<div class="pointer-events-auto absolute inset-0 z-10">
		<Canvas>
			<Scene />
		</Canvas>
	</div>

	<!-- Liquid Glass Components -->
	<div class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
		<div class="pointer-events-auto flex flex-col items-center gap-8">
			<!-- Main Glass Card -->
			<LiquidGlass
				glassStyle={currentStyle}
				wrapperStyle="padding: 2rem 3rem; backdrop-filter: blur(20px);"
			>
				<div class="text-center text-white">
					<h1 class="mb-4 text-3xl font-bold">Liquid Glass Effect</h1>
					<p class="mb-6 text-lg opacity-90">Experience the magic of glass distortion</p>
					<div class="flex justify-center gap-4">
						<button
							class="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
							onclick={() => (useVideoBg = !useVideoBg)}
						>
							{useVideoBg ? 'Show Wallpaper' : 'Show Video BG'}
						</button>
						<button
							class="rounded-lg bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/30"
							onclick={() => (useClassicStyle = !useClassicStyle)}
						>
							{useClassicStyle ? 'Modern Style' : 'Classic Style'}
						</button>
					</div>
				</div>
			</LiquidGlass>

			<!-- Bottom Glass Bar -->
			<div class="flex gap-4">
				<LiquidGlass
					glassStyle={{ ...currentStyle, radius: 25, depth: 16 }}
					wrapperStyle="padding: 1rem 2rem;"
				>
					<div class="text-sm text-white">
						Style: {useClassicStyle ? 'Classic' : 'Modern'}
					</div>
				</LiquidGlass>

				<LiquidGlass
					glassStyle={{ ...currentStyle, radius: 30, depth: 16 }}
					wrapperStyle="padding: 1rem; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center;"
				>
					<span class="text-2xl">🌊</span>
				</LiquidGlass>

				<LiquidGlass
					glassStyle={{ ...currentStyle, radius: 25, depth: 16 }}
					wrapperStyle="padding: 1rem 2rem;"
				>
					<div class="text-sm text-white">
						Background: {useVideoBg ? 'Video' : 'Image'}
					</div>
				</LiquidGlass>
			</div>
		</div>
	</div>
</div>
