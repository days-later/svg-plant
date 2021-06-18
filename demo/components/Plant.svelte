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

    $: if ($pos === $plant.genusName) {
        $plant.setAge( age );
    }
    else if ($plant.age < 1) {
        $plant.animate( $plant.age, 1, 1000 );
    }

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
    style="--fill: {fill || ''};"
    bind:this={el}
/>

<style>
    .plant {
        position: relative;
        flex: 0 0 100%;
        width: 100%;
        height: 100%;
        margin: 0;

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

    @media (max-width: 450px) {
        .plant {
            transform: scale( 1.5 );
            transform-origin: center bottom;
        }
    }
</style>
