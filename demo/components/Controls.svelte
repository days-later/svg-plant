<script lang="ts">
    import { color } from "./../lib/stores/color";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{ toggleTools: void, nav: number }>();

    export let hasPrev: boolean;
    export let hasNext: boolean;
    export let showTools: boolean;

    function shuffleSeed() {

    }
</script>

<div class="controls">
    <div class="btn shuffle" on:click={shuffleSeed}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
        <span>Shuffle</span>
    </div>
    <div class="btn color" on:click={() => color.set( !$color )}>
        {#if $color}
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
        {/if}
        <span>Color</span>
    </div>
    <div class="btn tools" on:click={() => dispatch( 'toggleTools' )}>
        {#if showTools}
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><g><path d="M0,0h24v24H0V0z" fill="none"/><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></g></svg>
        {/if}
        <span>Tools</span>
    </div>
    <div class="btn prev" class:inactive={!hasPrev} on:click={() => hasPrev && dispatch( 'nav', -1 )}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
        <span>Previous</span>
    </div>
    <div class="btn next" class:inactive={!hasNext} on:click={() => hasNext && dispatch( 'nav', 1 )}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
        <span>Next</span>
    </div>
</div>

<style>
    .controls {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;

        display: flex;
        justify-content: center;
        align-items: stretch;

        height: var( --ctrl-height );
        background: var( --panel-bg );

        transition: background-color .5s;
    }

    .controls > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100px;
        max-width: 25%;

        user-select: none;

        transition: background-color .5s;
    }
    .controls > div > svg {
        width: 48px;
        height: 48px;
        fill: var( --ctrl-btn-fg );

        transition: fill .5s;
    }
    .controls > div > span {
        margin: .5rem 0 0;
        font-size: var( --fs-sm );
        font-weight: bold;
        text-transform: uppercase;

        color: var( --ctrl-btn-fg );

        transition: color .5s;
    }

    .controls > div:hover {
        cursor: pointer;
        background: var( --ctrl-btn-hover-bg );
    }
    .controls > div:hover > svg,
    .controls > div:hover > span {
        fill: var( --ctrl-btn-hover-fg );
        color: var( --ctrl-btn-hover-fg );
    }

    .controls > div.inactive {
        cursor: default;
        background: transparent;
    }
    .controls > div.inactive > svg,
    .controls > div.inactive > span {
        fill: var( --ctrl-btn-inactive-fg );
        color: var( --ctrl-btn-inactive-fg );
    }
</style>
