<script lang="ts">
    import './vars.css';
    import './app.css';
    import { onMount } from 'svelte';
    import Controls from './components/Controls.svelte';
    import Tools from './components/Tools.svelte';
    import Plant from './components/Plant.svelte';
    import { getRandomColor } from './lib/util';
    import { Genera } from '../lib/main';
    import { Cfg, initialCfg, seeds, svgPlant } from './lib/Cfg';
    import { trackPointerPosition } from './lib/trackPointerPosition';

    let showTools = false;

    let generaKeys = Object.keys( Genera ) as (keyof typeof Genera)[];
    let generaIndex = generaKeys.findIndex( id => id === initialCfg.genus );
    if (generaIndex < 0) generaIndex = 0;

    const unsubColor = Cfg.color.subscribe( color => {
        if (color) document.documentElement.classList.remove( 'dark' );
        else document.documentElement.classList.add( 'dark' );

        Cfg.fill.set( color ? '' : getRandomColor() );
    });

    let plantEl: HTMLElement;
    async function animatePlantWrapper( isIn: boolean, from: string, to: string, ms: number ) {
        plantEl.setAttribute( 'style', `transition-duration: 0; left: ${from}; opacity: ${isIn ? 0 : 1}` );
        plantEl.offsetHeight;
        plantEl.setAttribute( 'style', `transition-duration: ${ms}ms; left: ${to}; opacity: ${isIn ? 1 : 0}` );
        await new Promise( r => setTimeout( r, ms ) );
    }
    async function nav( dir: number ) {
        const i = generaIndex + dir;
        if (i < 0 || i > generaKeys.length - 1) return;

        console.log( plantEl.offsetLeft );

        await animatePlantWrapper( false, '0', dir>0 ? '-100%' : '100%', 400 );

        generaIndex = i;
        const genusID = generaKeys[ generaIndex ];
        if (!(genusID in seeds)) seeds[ genusID ] = '';
        Cfg.plant.set({
            seed: seeds[ genusID ],
            genus: genusID,
        });

        await animatePlantWrapper( true, dir>0 ? '100%' : '-100%', '0', 400 );
    }

    const pad = .15;
    function onDrag({ y }: { y: number }) {
        const p = $svgPlant;
        p.age = 1 - (y < pad ? 0 : y > (1-pad) ? 1 : (y-pad) / (1 - 2*pad));
    }

    onMount(() => {
        return () => {
            unsubColor();
        }
    });
</script>

<div class="plant-wrapper" bind:this={plantEl} on:mousedown={() => showTools = false} use:trackPointerPosition={{ callback: onDrag }}>
    <Plant />
</div>

<Controls
    hasPrev={generaIndex > 0}
    hasNext={generaIndex < generaKeys.length - 1}

    {showTools}

    on:toggleTools={() => showTools = !showTools}
    on:nav={e => nav( e.detail )}
/>

{#if showTools}
    <Tools />
{/if}

<style>
    .plant-wrapper {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: var( --ctrl-height );

        width: 100%;

        padding: 1rem 0 0;

        overflow: hidden;
    }
    @media (max-width: 450px) {
        .plant-wrapper {
            width: 130%;
            margin-left: -15%;
        }
    }
</style>
