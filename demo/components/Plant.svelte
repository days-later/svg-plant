<script lang="ts">
    import { plantAction } from '../lib/plantAction';
    import { SvgPlant } from '../../lib/main';
    import type { GenusConstructor } from '../../lib/types';

    export let seed: string;
    export let genus: GenusConstructor;
    export let fill: string;

    $: svgPlant = new SvgPlant( new genus( seed ), { color: !fill } );

    export function getSvg() {
        return svgPlant.svgElement.outerHTML;
    }

</script>

<div class="plant" style="--fill: {fill};" use:plantAction={{ svgPlant }}></div>

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
