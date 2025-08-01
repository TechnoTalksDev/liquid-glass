
<script lang="ts">
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import ReactGlass from '$lib/components/ui/ReactGlass.svelte';
	import LiquidGlass from '$lib/components/ui/ReactGlass/LiquidGlass.svelte';
	import { SkipBack, Play, Pause, SkipForward, Volume2, Info } from '@lucide/svelte';

	let useVideoBg = true;
	const YOUTUBE_ID = 'hOgVAYpHPCc';

	// Info modal state
	let showInfoModal = false;
</script>

<div
	class="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center bg-cover bg-center"
	style="background-image: {useVideoBg ? 'none' : `url('/wallpaper.jpg')`}"
>
	{#if useVideoBg}
		<div style="position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;">
			<iframe
				title="background-video"
				width="100%"
				height="100%"
				src="https://www.youtube.com/embed/{YOUTUBE_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist={YOUTUBE_ID}&vq=hd2160"
				frameborder="0"
				allow="autoplay; encrypted-media"
				allowfullscreen
				style="position:absolute; top:50%; left:50%; width:100vw; height:56.25vw; min-height:100vh; min-width:177.78vh; transform:translate(-50%, -50%); pointer-events:none;"
			></iframe>
		</div>
	{/if}

	<div class="w-fit">
		<LiquidGlass
			glassStyle={{
				roughness: 0.1,
				metalness: 0.1,
				transmission: 0.9,
				thickness: 0.5,
				ior: 1.5,
				clearcoat: 1.0,
				clearcoatRoughness: 0.1
			}}
			style="min-width: 400px; min-height: 200px;"
		>
			<div class="flex flex-col items-center justify-center gap-4 p-8">
				<h1 class="text-6xl font-bold text-white opacity-80">Liquid Glass</h1>
				<button
					class="px-4 py-2 rounded bg-white/80 text-black font-semibold shadow"
					on:click={() => useVideoBg = !useVideoBg}
				>
					{useVideoBg ? 'Use Wallpaper Background' : 'Use Video Background'}
				</button>
				<p class="text-white/50">Converted React library to Svelte with Three.js</p>
			</div>
		</LiquidGlass>
	</div>
	<!-- <div class="w-fit mb-4">
    <GlassCard>
        <div class="flex flex-col items-center justify-center gap-4 z-50">
          <h1 class="text-6xl font-bold text-white opacity-80">Liquid Glass</h1>
          <button
            class="px-4 py-2 rounded bg-white/80 text-black font-semibold shadow "
            on:click={() => useVideoBg = !useVideoBg}
          >
            {useVideoBg ? 'Use Wallpaper Background' : 'Use Video Background'}
          </button>
          <p class="text-white/50">Inspiration from <a href="https://github.com/polidario/Frontend-Projects/tree/main/liquid-glass-vue" target="_blank"><span class="text-white/90">polidario</span></a></p>
        </div>
    </GlassCard>
  </div>

	<div class="w-fit" use:draggable={{ bounds: 'parent' }}>
		<GlassCard>
			<img
				alt="funny logo"
				class="aspect-square w-[5rem]"
				src="https://static.vecteezy.com/system/resources/previews/027/127/473/non_2x/microsoft-logo-microsoft-icon-transparent-free-png.png"
			/>
		</GlassCard>
	</div>

	<div class="w-fit" style="position:fixed; left:{dvdX}px; top:{dvdY}px; width:{dvdWidth}px; height:{dvdHeight}px; pointer-events:none;">
		<GlassCard>
			<img
				alt="funny logo"
				class="aspect-square w-[5rem]"
				src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
			/>
		</GlassCard>
	</div> -->

	<!-- Floating Action Button -->
	<div class="fixed right-6 bottom-6 z-50" on:click={() => (showInfoModal = true)}>
		<GlassCard>
			<button class="p-0 text-white/80 transition-colors hover:text-white">
				<Info size={32} />
			</button>
		</GlassCard>
	</div>

	<!-- Information Modal -->
	{#if showInfoModal}
		<div
			class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
			on:click={() => (showInfoModal = false)}
		>
			<div class="mx-4 w-fit max-w-md" on:click|stopPropagation>
				<GlassCard>
					<div class="space-y-4 p-6">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-semibold text-white">Hi from the creator</h3>
							<button
								class="p-1 text-white/60 transition-colors hover:text-white"
								on:click={() => (showInfoModal = false)}
								aria-label="Close information modal"
							>
								<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						</div>
						<p class="text-sm leading-relaxed text-white/80">
							I was incredibly fascinated by the iOS 26 “liquid glass” update on my iPhone and
							wanted to recreate the effect. I stumbled upon <a
								href="https://www.youtube.com/watch?v=Cv8zFvM8fEk"
								class="text-blue-300"
								target="_blank">this video</a
							>
							and decided to see how far I could push it. <br /><br />

							This project is my own take on the iOS media player UI, with a bit of personal flair.
							The interface you see here is actually powered by live Spotify data, pulled every ~5
							seconds, which enables the real-time progress bar for the currently playing song.<br
							/><br />

							Playback, track skip, and volume controls are just there for the sake of UI
							completeness (and my sanity)—they're non-functional, since I didn’t want to give the
							internet full control over my music.<br /><br />

							The source code is public on
							<a
								href="https://github.com/TechnoTalksDev/liquid-glass"
								class="text-blue-300"
								target="_blank">GitHub</a
							>
							if you want to take a peek. The backend is built using an n8n workflow and Redis cache
							to avoid hitting Spotify’s rate limits when handling multiple users. Threw this
							together in a day, so if you run into any quirks... just pretend you didn’t :)
							<br /><br />

							Here's the
							<a
								href="https://www.youtube.com/watch?v=hOgVAYpHPCc"
								class="text-blue-300"
								target="_blank">video in the background</a
							> btw
						</p>
						<!-- <div class="flex justify-end">
							<button 
								class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
								on:click={() => showInfoModal = false}
							>
								Close
							</button>
						</div> -->
					</div>
				</GlassCard>
			</div>
		</div>
	{/if}


</div>