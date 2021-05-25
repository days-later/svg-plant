<script lang="ts">
    import { onMount } from 'svelte';
    import { Cfg, svgPlant, svgPlantUpdate } from '../lib/Cfg';

    const fill = Cfg.fill;

    let el: HTMLElement;

    onMount(() => {
        const unsubSvgPlant = svgPlant.subscribe( plant => {
            el.innerHTML = '';
            el.appendChild( plant.svgElement );
        });
        const unsubSvgPlantUpdate = svgPlantUpdate.subscribe( ({ regrow }) => {
            if (regrow) {
                $svgPlant.animate( 0, 1, 1000 );
            }
        });

        return () => {
            unsubSvgPlant();
            unsubSvgPlantUpdate();
        }
    });
</script>

<div class="plant" style="--fill: {$fill};" bind:this={el}></div>

<style>
    .plant {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .plant :global( svg ) {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: fill .5s, left 1s;

        fill: var( --fill );
    }
</style>
