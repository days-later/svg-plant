<script lang="ts">
    import './vars.css';
    import './app.css';
    import { onMount } from 'svelte';
    import Controls from './components/Controls.svelte';
    import Tools from './components/Tools.svelte';
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
        goto( generaIndex );
    }
    function goto( i: number, smooth = true ) {
        slidesEl.scrollTo({ top: 0, left: i * slidesEl.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
    }

    let scrollTo: number;
    function onScroll() {
        clearTimeout( scrollTo );
        scrollTo = window.setTimeout(() => {

            generaIndex = Math.round( slidesEl.scrollLeft / slidesEl.clientWidth );
            age = 1;
            pos.set( generaKeys[ generaIndex ] );

        }, 100 );
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

<div class="slides" bind:this={slidesEl} on:mousedown={() => showTools = false} use:trackPointerPosition={{ callback: onDrag }} on:scroll={onScroll}>
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

{#if showTools}
    <Tools on:close={() => showTools = false} />
{/if}

<style>
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

        scrollbar-width: none;
        scroll-snap-type: x mandatory;
    }
</style>
