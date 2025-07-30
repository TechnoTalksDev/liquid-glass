<script>
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import { draggable } from '@neodrag/svelte';
import { onMount } from 'svelte';
let dvdX = 100;
let dvdY = 100;
let dvdVX = 1.5;
let dvdVY = 1;
let dvdWidth = 100;
let dvdHeight = 100;
	/**
	 * @type {number}
	 */
let raf;

let useVideoBg = false;
const YOUTUBE_ID = 'G5RpJwCJDqc';

function animateDVD() {
	const screenW = window.innerWidth;
	const screenH = window.innerHeight;
	dvdX += dvdVX;
	dvdY += dvdVY;
	if (dvdX <= 0 || dvdX + dvdWidth >= screenW) {
		dvdVX *= -1;
		dvdX = Math.max(0, Math.min(dvdX, screenW - dvdWidth));
	}
	if (dvdY <= 0 || dvdY + dvdHeight >= screenH) {
		dvdVY *= -1;
		dvdY = Math.max(0, Math.min(dvdY, screenH - dvdHeight));
	}
	raf = requestAnimationFrame(animateDVD);
}

onMount(() => {
	raf = requestAnimationFrame(animateDVD);
	return () => cancelAnimationFrame(raf);
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
	<div class="w-fit mb-4">
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
	</div>
</div>
