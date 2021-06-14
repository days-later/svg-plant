<script lang="ts">
    import type { Readable } from 'svelte/store';
    import type { SvgPlant } from 'lib/main';
    import { color } from '../lib/stores/color';
    import { pos } from '../lib/stores/pos';

    export let plant: Readable<SvgPlant>;
    export let age: number;
    export let fill: string;

    let el: HTMLElement;
    let init = true;

    $: $plant.setColor( $color )

    $: isSelected = $pos === $plant.genusName;
    $: if (isSelected) { $plant.setAge( age ); }
    $: if (isSelected && $plant.age !== 1) { $plant.setAge( 1 ); }

    function updatePlant() {
        el.innerHTML = '';
        el.appendChild( $plant.svgElement );

        if (init) init = false;
        else $plant.animate( 0, 1, 1000 );
    }
    $: if ($plant && el) updatePlant();
</script>

<div
    class="plant"
    style="--fill: {fill};"
    bind:this={el}
/>

<style>
    .plant {
        position: relative;
        flex: 0 0 100%;
        width: 100%;
        height: 100%;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        scroll-snap-align: center;
    }

    .plant :global( svg ) {
        position: absolute;
        top: 5vh;
        left: 5vw;
        width: calc( 100% - 10vw );
        height: calc( 100% - 5vh );
        transition: fill .5s, left 1s;

        fill: var( --fill );
    }
</style>
