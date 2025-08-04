<script>
	import { getDisplacementFilter } from './GlassElement/getDisplacementFilter';
	import { onMount } from 'svelte';

	let cardElement;
	let width = 0;
	let height = 0;
	let filterUrl = '';

	// Configuration values
	const depth = 10;
	const radius = 32;
	const blur = 2;
	const chromaticAberration = 5;
	const strength = 100;

	function updateFilter() {
		if (width > 0 && height > 0) {
			filterUrl = getDisplacementFilter({
				height,
				width,
				radius,
				depth,
				strength,
				chromaticAberration,
			});
		}
	}

	function applyFilter() {
		if (cardElement && filterUrl) {
			cardElement.style.backdropFilter = `blur(${blur / 2}px) url('${filterUrl}') blur(${blur}px) brightness(1.1) saturate(1.5)`;
		}
	}

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				width = entry.contentRect.width;
				height = entry.contentRect.height;
				updateFilter();
			}
		});

		if (cardElement) {
			resizeObserver.observe(cardElement);
		}

		return () => {
			resizeObserver.disconnect();
		};
	});

	$: if (width && height) {
		updateFilter();
	}

	$: if (filterUrl) {
		applyFilter();
	}
</script>

<div class="card" bind:this={cardElement}>
	<slot />
</div>

<style>
	.card {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		overflow: hidden;
		border-radius: 32px;
		transition: opacity 0.26s ease-out;
		filter: drop-shadow(-8px -10px 46px #0000005f);
	}

	.card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		border-radius: 28px;
		pointer-events: none;
		-webkit-box-shadow:
			inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7),
			inset 0 0 3px 1px rgba(255, 255, 255, 0.7);
		box-shadow:
			inset 6px 6px 0px -6px rgba(255, 255, 255, 0.7),
			inset 0 0 8px 1px rgba(255, 255, 255, 0.7);
	}
</style>
