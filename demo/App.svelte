<script lang="ts">
    import './vars.css';
    import './app.css';
    import { onMount } from 'svelte';
    import Controls from './components/Controls.svelte';
    import { getRandomColor } from './lib/util';
    import { Genera } from '../lib/main';
    import { color } from './lib/stores/color';
    import { pos } from './lib/stores/pos';
    import Plant from './components/Plant.svelte';
    import { plants } from './lib/stores/plants';
    import { trackPointerPosition } from './lib/trackPointerPosition';

    let showTools = false;

    let generaKeys = Object.keys( Genera ) as (keyof typeof Genera)[];
    let generaIndex = generaKeys.findIndex( id => id === $pos );
    if (generaIndex < 0) generaIndex = 0;

    let fill: string;
    const unsubColor = color.subscribe( color => {
        if (color) document.documentElement.classList.remove( 'dark' );
        else {
            document.documentElement.classList.add( 'dark' );
            fill = getRandomColor();
        }
    });

    let slidesEl: HTMLElement;
    function nav( dir: number ) {
        const i = generaIndex + dir;
        if (i < 0 || i > generaKeys.length - 1) return;

        generaIndex = i;
        pos.set( generaKeys[ generaIndex ] );

        goto( generaIndex );
    }
    function goto( i: number, smooth = true ) {
        slidesEl.scrollTo({ top: 0, left: i * slidesEl.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    }

    const pad = .15;
    let age = 1;
    function onDrag({ y }: { y: number }) {
        age = 1 - (y < pad ? 0 : y > (1-pad) ? 1 : (y-pad) / (1 - 2*pad));
    }

    onMount(() => {
        goto( generaIndex, false );
        return () => {
            unsubColor();
        }
    });
</script>

<div class="slides" bind:this={slidesEl} on:mousedown={() => showTools = false} use:trackPointerPosition={{ callback: onDrag }}>
    {#each generaKeys as g}
        <Plant {age} {fill} plant={plants[ g ]} />
    {/each}
</div>

<Controls
    hasPrev={generaIndex > 0}
    hasNext={generaIndex < generaKeys.length - 1}

    {showTools}

    on:toggleTools={() => showTools = !showTools}
    on:nav={e => nav( e.detail )}
/>

<!--
{#if showTools}
    <Tools />
{/if}
-->

<style>
    /* TODO - inside Plant.svelte i guess
    @media (max-width: 450px) {
        .plant-wrapper {
            width: 130%;
            margin-left: -15%;
        }
    }
    */

    .slides {
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: var( --ctrl-height );

        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: flex-start;

        width: 100%;

        overflow: hidden;
        overflow-x: scroll;

        scrollbar-width: none;

        scroll-snap-type: x mandatory;
    }
    .slides::-webkit-scrollbar {
        height: 1rem;
        background: #aaa;
    }
    .slides::-webkit-scrollbar-thumb {
        background: #555;
    }

    .slides > div {
        flex: 0 0 100%;
        width: 100%;
        height: 100%;

        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;

        scroll-snap-align: center;
    }
</style>
