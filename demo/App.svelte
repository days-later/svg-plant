<script lang="ts">
    import './vars.css';
    import './app.css';
    import { onMount } from 'svelte';
    import favicon from './assets/favicon.ico';
    import Controls from './components/Controls.svelte';
    import Tools from './components/Tools.svelte';
    import Plant from './components/Plant.svelte';
    import { getRandomColor } from './lib/util';
    import { Genera } from '../lib/main';

    let seed = (Math.random() + '').substring( 2 );
    let color = true;
    let fill = '';
    let showTools = false;

    let generaKeys = Object.keys( Genera );
    let generaIndex = 0;
    $: hasPrev = generaIndex > 0;
    $: hasNext = generaIndex < generaKeys.length - 1;
    $: genus = Genera[ generaKeys[ generaIndex ] as keyof typeof Genera ];

    let getSvg: () => string;

    function setSeed( _seed?: string ) {
        seed = _seed ? _seed : (Math.random() + '').substring( 2 );
    }
    function toggleColor() {
        color = !color;
        if (color) document.documentElement.classList.remove( 'dark' );
        else document.documentElement.classList.add( 'dark' );

        fill = color ? '' : getRandomColor();
    }

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

        await animatePlantWrapper( false, '0', dir>0 ? '-100%' : '100%', 600 );

        generaIndex = i;

        await animatePlantWrapper( true, dir>0 ? '100%' : '-100%', '0', 600 );
    }

    onMount(() => {
        if (!color) {
            color = true;
            toggleColor();
        }
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div class="plant-wrapper" bind:this={plantEl} on:mousedown={() => showTools = false}>
    <Plant {seed} {genus} {fill} bind:getSvg />
</div>

<Controls
    {color} {hasPrev} {hasNext} {showTools}

    on:shuffle={() => setSeed()}
    on:toggleColor={toggleColor}
    on:toggleTools={() => showTools = !showTools}
    on:nav={e => nav( e.detail )}
/>

{#if showTools}
    <Tools genusName={genus.genusName} {seed} {getSvg} on:setSeed={e => setSeed( e.detail )} />
{/if}

<style>
    .plant-wrapper {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: var( --ctrl-height );

        width: 100%;

        padding: 2rem 2rem 0;

        overflow: hidden;
    }
</style>
