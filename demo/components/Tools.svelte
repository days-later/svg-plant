<script lang="ts">
    import { Cfg, genusName, svgPlant } from '../lib/Cfg';
    import { fly } from 'svelte/transition';
    import { copyToClipboard } from '../lib/util';
    import { isMobile } from '../lib/mediaQuery';

    const plantCfg = Cfg.plant;

    let newSeed = '';
    function setSeed() {
        Cfg.plant.set({
            seed: newSeed,
            genus: $plantCfg.genus,
        });
        newSeed = '';
    }
</script>

<div class="tools" transition:fly={{ duration: 600, y: 200 * ($isMobile ? -1 : 1) }}>
    <div>
        <div>
            <span class="label">Genus</span>
            <span class="value">{$genusName}</span>
        </div>
        <div>
            <span class="label">Seed</span>
            <span class="value">{$plantCfg.seed}</span>
            <span class="btn copy-seed" on:click={() => copyToClipboard( $plantCfg.seed )}>copy</span>
        </div>
        <div>
            <input type="text" name="seed" id="seed-input" bind:value={newSeed}>
            <span class="btn set-seed" on:click={setSeed}>set seed</span>
        </div>
        <div>
            <span class="btn copy-svg" on:click={() => copyToClipboard( $svgPlant.svgElement.outerHTML )}>copy svg to clipboard</span>
        </div>
    </div>
</div>

<style>
    .tools {
        position: absolute;
        left: 0;
        right: 0;
        bottom: var( --ctrl-height );
        z-index: 9;

        pointer-events: none;
    }

    .tools > div {
        width: 600px;
        max-width: 100%;
        max-height: calc(100vh - 110px);
        margin: 0 auto;
        padding: 1rem;

        pointer-events: all;

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
            bottom: auto;
        }
        .tools > div {
            border-top: 6px dotted var( --bg );
            border-bottom: 0;
        }
    }
</style>
