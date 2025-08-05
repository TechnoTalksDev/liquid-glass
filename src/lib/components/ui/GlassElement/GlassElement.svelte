<script lang="ts">
	import { getDisplacementFilter, type DisplacementOptions } from './getDisplacementFilter';
	import { getDisplacementMap } from './getDisplacementMap';
	import './GlassElement.css';

	export let height!: number;
	export let width!: number;
	export let depth!: number;
	export let radius!: number;
	export let strength!: number;
	export let chromaticAberration!: number;
	export let blur: number = 2;
	export let debug: boolean = false;

	let clicked = false;

	// whenever clicked or depth change, recompute actualDepth
	$: actualDepth = depth / (clicked ? 0.7 : 1);

	// recompute the backdrop-filter URL when inputs change
	$: filterUrl = getDisplacementFilter({
		height,
		width,
		radius,
		depth: actualDepth,
		strength,
		chromaticAberration
	});

	// recompute the displacement‐map URL when needed
	$: mapUrl = getDisplacementMap({
		height,
		width,
		radius,
		depth: actualDepth
	});

	// build the style string
	$: styleString = debug
		? `
      height: ${height}px;
      width: ${width}px;
      border-radius: ${radius}px;
      background: url("${mapUrl}");
      box-shadow: none;
    `
		: `
      height: ${height}px;
      width: ${width}px;
      border-radius: ${radius}px;
      backdrop-filter:
        blur(${blur / 2}px)
        url('${filterUrl}')
        blur(${blur}px)
        brightness(1.1)
        saturate(1.5);
    `;
</script>

<div class="box" style={styleString}>
	<div
		style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;"
	>
		<slot />
	</div>
</div>
