<script lang="ts">
	import { T } from '@threlte/core';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import PillGeometry from './PillGeometry.js';

	interface GlassStyle {
		depth: number;
		segments: number;
		radius: number;
		tint: number | null;
		roughness: number;
		transmission: number;
		reflectivity: number;
		ior: number;
		dispersion: number;
		thickness: number;
	}

	interface Props {
		dimensions: { width: number; height: number };
		currentGlassStyle: GlassStyle;
		backgroundTexture: HTMLCanvasElement | null;
		glassPosition: { x: number; y: number };
	}

	const { dimensions, currentGlassStyle, backgroundTexture, glassPosition }: Props = $props();

	// Three.js objects
	let glassMesh = $state<THREE.Mesh | undefined>(undefined);
	let backgroundMesh = $state<THREE.Mesh | undefined>(undefined);
	let glassGeometry = $state<PillGeometry | undefined>(undefined);
	let glassMaterial = $state<THREE.MeshPhysicalMaterial | undefined>(undefined);
	let backgroundGeometry = $state<THREE.PlaneGeometry | undefined>(undefined);
	let backgroundMaterial = $state<THREE.MeshBasicMaterial | undefined>(undefined);
	let canvasTexture = $state<THREE.CanvasTexture | null>(null);

	// Create glass geometry
	$effect(() => {
		if (glassMesh && dimensions.width > 0 && dimensions.height > 0) {
			updateGlassGeometry();
		}
	});

	// Update glass material when style changes
	$effect(() => {
		if (
			glassMaterial &&
			(currentGlassStyle.roughness ||
				currentGlassStyle.transmission ||
				currentGlassStyle.thickness ||
				currentGlassStyle.ior ||
				currentGlassStyle.reflectivity ||
				currentGlassStyle.dispersion ||
				currentGlassStyle.tint)
		) {
			updateGlassMaterial();
		}
	});

	// Update background texture when it changes
	$effect(() => {
		if (backgroundTexture) {
			updateBackgroundTexture();
		}
	});

	// Update background position when glass position changes - debounced
	let positionUpdateTimeout: number;
	$effect(() => {
		if (backgroundMesh && glassPosition.x !== undefined && glassPosition.y !== undefined) {
			clearTimeout(positionUpdateTimeout);
			positionUpdateTimeout = setTimeout(() => {
				updateBackgroundPosition();
			}, 16); // ~60fps throttling
		}
	});

	function createGlassGeometry() {
		if (glassGeometry) {
			glassGeometry.dispose();
		}

		glassGeometry = new PillGeometry(
			dimensions.width,
			dimensions.height,
			currentGlassStyle.depth,
			currentGlassStyle.segments,
			currentGlassStyle.radius
		);

		return glassGeometry;
	}

	function createGlassMaterial() {
		glassMaterial = new THREE.MeshPhysicalMaterial({
			roughness: currentGlassStyle.roughness,
			transmission: currentGlassStyle.transmission,
			thickness: currentGlassStyle.thickness,
			ior: currentGlassStyle.ior,
			reflectivity: currentGlassStyle.reflectivity,
			dispersion: currentGlassStyle.dispersion
		});

		if (typeof currentGlassStyle.tint === 'number') {
			glassMaterial.color.set(currentGlassStyle.tint);
		}

		return glassMaterial;
	}

	function createBackgroundGeometry() {
		if (backgroundGeometry) {
			backgroundGeometry.dispose();
		}

		const targetWidth = backgroundTexture?.width || 1920;
		const targetHeight = backgroundTexture?.height || 1080;

		backgroundGeometry = new THREE.PlaneGeometry(targetWidth, targetHeight);
		return backgroundGeometry;
	}

	function createBackgroundMaterial() {
		backgroundMaterial = new THREE.MeshBasicMaterial({
			transparent: false
		});

		if (canvasTexture) {
			backgroundMaterial.map = canvasTexture;
		}

		return backgroundMaterial;
	}

	function updateGlassGeometry() {
		if (!glassMesh) return;

		const newGeometry = createGlassGeometry();
		glassMesh.geometry.dispose();
		glassMesh.geometry = newGeometry;
	}

	function updateGlassMaterial() {
		if (!glassMaterial) return;

		glassMaterial.roughness = currentGlassStyle.roughness;
		glassMaterial.transmission = currentGlassStyle.transmission;
		glassMaterial.thickness = currentGlassStyle.thickness;
		glassMaterial.ior = currentGlassStyle.ior;
		glassMaterial.reflectivity = currentGlassStyle.reflectivity;
		glassMaterial.dispersion = currentGlassStyle.dispersion;

		if (typeof currentGlassStyle.tint === 'number') {
			glassMaterial.color.set(currentGlassStyle.tint);
		}

		glassMaterial.needsUpdate = true;
	}

	function updateBackgroundTexture() {
		if (!backgroundTexture) return;

		// Dispose old texture
		if (canvasTexture) {
			canvasTexture.dispose();
		}

		// Create new texture
		canvasTexture = new THREE.CanvasTexture(backgroundTexture);
		canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
		canvasTexture.wrapT = THREE.ClampToEdgeWrapping;

		// Update background material
		if (backgroundMaterial) {
			backgroundMaterial.map = canvasTexture;
			backgroundMaterial.needsUpdate = true;
		}

		// Update background geometry size
		if (backgroundGeometry) {
			backgroundGeometry.dispose();
			const newGeometry = createBackgroundGeometry();
			if (backgroundMesh) {
				backgroundMesh.geometry = newGeometry;
			}
		}
	}

	function updateBackgroundPosition() {
		if (!backgroundMesh || !backgroundTexture) return;

		// Position the background mesh relative to the glass
		backgroundMesh.position.set(-glassPosition.x, glassPosition.y, -currentGlassStyle.depth / 2);
	}

	// Initialize geometries and materials
	onMount(() => {
		glassGeometry = createGlassGeometry();
		glassMaterial = createGlassMaterial();
		backgroundGeometry = createBackgroundGeometry();
		backgroundMaterial = createBackgroundMaterial();
	});
</script>

<T.Scene>
	<!-- Glass mesh -->
	{#if glassGeometry && glassMaterial}
		<T.Mesh
			bind:ref={glassMesh}
			geometry={glassGeometry}
			material={glassMaterial}
			position={[0, 0, 0]}
		/>
	{/if}

	<!-- Background mesh -->
	{#if backgroundGeometry && backgroundMaterial}
		<T.Mesh
			bind:ref={backgroundMesh}
			geometry={backgroundGeometry}
			material={backgroundMaterial}
			position={[-glassPosition.x, glassPosition.y, -currentGlassStyle.depth / 2]}
		/>
	{/if}

	<!-- Camera -->
	<T.OrthographicCamera
		left={-dimensions.width / 2}
		right={dimensions.width / 2}
		top={dimensions.height / 2}
		bottom={-dimensions.height / 2}
		near={0.1}
		far={20000}
		position={[0, 0, 512]}
		makeDefault
	/>
</T.Scene>
