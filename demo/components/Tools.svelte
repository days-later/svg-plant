<script lang="ts">
    import { fly } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    import { copyToClipboard } from '../lib/util';
    import { isMobile } from '../lib/mediaQuery';
    import { seeds } from '../lib/stores/seeds';
    import { pos } from '../lib/stores/pos';
    import { plants } from '../lib/stores/plants';

    const dispatch = createEventDispatcher<{ close: void }>();

    $: currentSeed = seeds[ $pos ];
    $: currentPlant = plants[ $pos ];

    let newSeed = '';
    function setSeed() {
        currentSeed.set( newSeed );
        newSeed = '';
    }
</script>

<div class="tools" transition:fly={{ duration: 600, y: 200 * ($isMobile ? -1 : 1) }} on:click|self={() => dispatch( 'close' )}>
    <div>
        <div>
            <span class="label">Genus</span>
            <span class="value">{$pos}</span>
        </div>
        <div>
            <span class="label">Seed</span>
            <span class="value">{$currentSeed}</span>
            <span class="btn copy-seed" on:click={() => copyToClipboard( $currentSeed )}>copy</span>
        </div>
        <div>
            <input type="text" name="seed" id="seed-input" bind:value={newSeed}>
            <span class="btn set-seed" on:click={setSeed}>set seed</span>
        </div>
        <div>
            <span class="btn copy-svg" on:click={() => copyToClipboard( $currentPlant.svgElement.outerHTML )}>copy svg to clipboard</span>
        </div>
    </div>
</div>

<style>
    .tools {
        position: absolute;
        top: 0;
        left: 0;
        bottom: var( --ctrl-height );
        right: 0;

        z-index: 9;

        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-end;
        align-items: center;
    }

    .tools > div {
        width: 600px;
        max-width: 100%;
        max-height: calc(100vh - 110px);
        padding: 1rem;

        overflow: hidden;
        overflow-y: auto;

        background: var( --panel-bg );
        border-bottom: 1px dashed var( --bg );
    }
    .tools > div > div {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: stretch;

        margin: 1rem;
    }

    .tools > div > div > span,
    .tools > div > div > input {
        margin-right: .5rem;
    }
    .tools > div > div > span:last-child,
    .tools > div > div > input:last-child {
        margin-right: 0;
    }

    .tools > div > div > span.label {
        align-self: flex-end;
        min-width: 50px;
        margin: 0;
        padding: .5rem .5rem .3rem 0;

        font-size: var( --fs-sm );
        line-height: 1;
        font-weight: bold;
        text-transform: uppercase;
    }
    .value {
        align-self: flex-end;
        padding: .5rem 0 .25rem 0;

        flex: 1 1 auto;
        font-size: var( --fs-md );
        line-height: 1;
    }
    input {
        flex: 1 1 auto;
        margin: 0;
        padding: .5rem;

        font-size: var( --fs-sm );
        line-height: 1;

        background: var( --input-bg );
        border: 1px solid var( --input-border );
        border-radius: .25rem;
    }

    .btn {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;

        padding: .5rem;

        font-size: var( --fs-sm );
        line-height: 1;
        font-weight: bold;
        text-transform: uppercase;

        color: var( --btn-fg );
        background: var( --btn-bg );
        border-radius: .25rem;
    }
    .btn:hover {
        cursor: pointer;
        color: var( --btn-hover-fg );
        background: var( --btn-hover-bg );
    }

    @media (max-width: 450px) {
        .tools {
            top: -3px;
            justify-content: flex-start;
        }
        .tools > div {
            border-top: 6px dotted var( --bg );
            border-bottom: 0;
        }
    }
</style>
