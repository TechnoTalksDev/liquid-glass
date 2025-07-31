<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
  import { FastAverageColor } from 'fast-average-color';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import { SkipBack, Play, Pause, SkipForward, Volume2, Info } from '@lucide/svelte';

  const fac = new FastAverageColor();

	// Browser detection
	let isChromeBased = true;
	let showBrowserWarning = false;

	export let data:PageData;
	
	// Reactive statement to update music data when server data changes
	$: if (data.music) {
    console.dir(data.music, {depth: null});
		update_music_data();
	}
	
  /*Music data*/
  let song_name:string
  let song_image:string 
  let song_image_color:string

  let artists:string
  let song_duration_ms:number
  let song_progress_ms:number
  let is_playing:boolean
  let volume:number = Math.random() * 100 // Default volume

  
  // Helper function to format time
  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Browser detection function
  function detectChromeBrowser(): boolean {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent);
    const isEdge = /Edg/.test(userAgent);
    const isOpera = /OPR/.test(userAgent);
    const isBrave = /Brave/.test(userAgent);
    const isVivaldi = /Vivaldi/.test(userAgent);
    
    // Chrome-based browsers include Chrome, Edge (Chromium), Opera, Brave, Vivaldi, etc.
    return isChrome || isEdge || isOpera || isBrave || isVivaldi;
  }
  
  function update_music_data() {
    // Check if data.music exists and is an object
    if (data.music && typeof data.music === 'object') {
      const spotifyData = data.music;
      
      // Check if music is currently playing and has item data
      if (spotifyData.is_playing && spotifyData.item) {
        song_name = spotifyData.item.name;
        song_image = spotifyData.item.album.images[0].url;
        
        // Extract playback information
        song_duration_ms = spotifyData.item.duration_ms;
        song_progress_ms = spotifyData.progress_ms;
        is_playing = spotifyData.is_playing;
        
        // Build artists string from the artists array
        artists = "";
        spotifyData.item.artists.forEach((element: any) => {
          artists += element.name + ", ";
        });
        artists = artists.slice(0, -2); // Remove trailing comma and space

        // Get the dominant color from the album art
        fac.getColorAsync(spotifyData.item.album.images[0].url)
          .then(color => {
            song_image_color = color.hex;
          })
          .catch(e => {
            console.log(e);
          });
      } else {
        // Not playing or no item data
        song_name = "Not playing";
        song_image = "https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png";
        artists = "Not playing";
        song_image_color = "#000000";
        song_duration_ms = 0;
        song_progress_ms = 0;
        is_playing = false;
      }
    } else {
      // No music data available
      song_name = "Not playing";
      song_image = "https://upload.wikimedia.org/wikipedia/commons/2/24/Transparent_Square_Tiles_Texture.png";
      artists = "Not playing";
      song_image_color = "#000000";
      song_duration_ms = 0;
      song_progress_ms = 0;
      is_playing = false;
    }
  }
 
  let formattedDate:string
  let formattedTime:string

	onMount(() => {
		// Check browser compatibility
		isChromeBased = detectChromeBrowser();
		if (!isChromeBased) {
			showBrowserWarning = true;
		}

		// Initialize the music data and time on first load
		update_music_data();
		
		// Initialize time immediately
		const now = new Date();
		formattedDate = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
		formattedTime = now.toLocaleString('en-US', { timeStyle: 'short' });
		
		const interval = setInterval(() => {
      //console.log("Refreshing data")
			// Use invalidateAll() for server-side load functions
			invalidateAll();
      
      // Update time immediately without waiting for data refresh
      const now = new Date();
      formattedDate = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      formattedTime = now.toLocaleString('en-US', { timeStyle: 'short' });
    }, 2500);

		return () => {
			clearInterval(interval);
		};
	});

	let useVideoBg = true;
const YOUTUBE_ID = 'hOgVAYpHPCc';

	// Info modal state
	let showInfoModal = false;
</script>

<svelte:head>
	<title>{song_name && song_name !== "Not playing" ? `${song_name}${artists ? ` - ${artists}` : ''} | Liquid Glass` : 'Liquid Glass - Not Playing'}</title>
</svelte:head>

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
		<GlassCard>
			<div class="flex flex-col items-center justify-center w-[350px] p-6 gap-4">
				<!-- Album Art -->
				<div class="relative w-[300px] h-[300px] flex-shrink-0">
					<img 
						id="song-image" 
						style="box-shadow: 0px 0px 100px {song_image_color};" 
						src="{song_image}" 
						class="w-full h-full rounded-2xl object-cover"
						alt="Track"
					/>
				</div>
				
				<!-- Song Info -->
				<div class="text-center space-y-1 w-full z-50">
					<h2 class="text-white font-semibold text-lg truncate">{song_name}</h2>
					<p class="text-white/70 text-sm truncate">{artists}</p>
				</div>
				
				<!-- Progress Bar -->
				<div class="w-full space-y-2">
					<div class="w-full h-2 bg-white/20 rounded-full overflow-hidden">
						<div 
							class="h-full bg-white rounded-full transition-all duration-300" 
							style="width: {song_duration_ms > 0 ? (song_progress_ms / song_duration_ms) * 100 : 0}%"
						></div>
					</div>
					<div class="flex justify-between text-xs text-white/60">
						<span>{formatTime(song_progress_ms)}</span>
						<span>-{formatTime(song_duration_ms - song_progress_ms)}</span>
					</div>
				</div>
				
				<!-- Control Buttons -->
				<div class="flex items-center justify-center gap-6 w-full">
					<button class="text-white/80 hover:text-white transition-colors p-2">
						<SkipBack size={20} />
					</button>
					
					<button class="text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20 rounded-full p-3">
						{#if is_playing}
							<Pause size={24} fill="currentColor" />
						{:else}
							<Play size={24} fill="currentColor" />
						{/if}
					</button>
					
					<button class="text-white/80 hover:text-white transition-colors p-2">
						<SkipForward size={20} />
					</button>
				</div>
				
				<!-- Volume Control -->
				<div class="flex items-center gap-3 w-full">
					<Volume2 size={16} class="text-white/60" />
					<div class="flex-1 h-[.4rem] bg-white/20 rounded-full overflow-hidden">
						<div 
							class="h-full bg-white/60 rounded-full" 
							style="width: {volume}%"
						></div>
					</div>
					<Volume2 size={16} class="text-white/40" />
				</div>
			</div>
		</GlassCard>
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
	<div class="fixed bottom-6 right-6 z-50" on:click={() => showInfoModal = true}>
		<GlassCard>
			<button 
				class="p-0 text-white/80 hover:text-white transition-colors"
				
			>
				<Info size={32} />
			</button>
		</GlassCard>
	</div>

	<!-- Information Modal -->
	{#if showInfoModal}
		<div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 " on:click={() => showInfoModal = false} >
			<div class="w-fit max-w-md mx-4" on:click|stopPropagation>
				<GlassCard>
					<div class="p-6 space-y-4">
						<div class="flex items-center justify-between">
							<h3 class="text-xl font-semibold text-white">Hi from the creator</h3>
							<button 
								class="text-white/60 hover:text-white transition-colors p-1"
								on:click={() => showInfoModal = false}
								aria-label="Close information modal"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>
						</div>
						<p class="text-white/80 text-sm leading-relaxed">
							I was incredibly fascinated by the iOS 26 “liquid glass” update on my iPhone and wanted to recreate the effect. I stumbled upon <a href="https://www.youtube.com/watch?v=Cv8zFvM8fEk" class="text-blue-300" target="_blank">this video</a> and decided to see how far I could push it. <br/><br/>

This project is my own take on the iOS media player UI, with a bit of personal flair. The interface you see here is actually powered by live Spotify data, pulled every ~5 seconds, which enables the real-time progress bar for the currently playing song.<br/><br/>

Playback, track skip, and volume controls are just there for the sake of UI completeness (and my sanity)—they're non-functional, since I didn’t want to give the internet full control over my music.<br/><br/>

The source code is public on <a href="https://github.com/TechnoTalksDev/liquid-glass" class="text-blue-300" target="_blank">GitHub</a> if you want to take a peek. The backend is built using an n8n workflow and Redis cache to avoid hitting Spotify’s rate limits when handling multiple users. Threw this together in a day, so if you run into any quirks... just pretend you didn’t :) <br/><br/>

Here's the <a href="https://www.youtube.com/watch?v=hOgVAYpHPCc" class="text-blue-300" target="_blank">video in the background</a> btw
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

	<!-- Browser Compatibility Warning -->
	{#if showBrowserWarning}
		<div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div class="w-fit max-w-lg mx-4">
				<GlassCard>
					<div class="p-8 space-y-6 text-center">
						<div class="text-6xl mb-4">🌐</div>
						<h3 class="text-2xl font-bold text-white">Chrome-Based Browser Required</h3>
						<p class="text-white/80 text-base leading-relaxed">
							This liquid glass experience requires a Chrome-based browser for the glass effects to work. 
						</p>
						<p class="text-white/70 text-sm">
							WILL NOT WORK ON NON CHROME BROWSERS
						</p>
						<div class="flex flex-col sm:flex-row gap-3 justify-center">
							<button 
								class="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
								on:click={() => showBrowserWarning = false}
							>
								Continue anyway knowing I won't see the glass effect
							</button>
						</div>
					</div>
				</GlassCard>
			</div>
		</div>
	{/if}
</div>
