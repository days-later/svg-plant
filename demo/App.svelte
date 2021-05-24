<script lang="ts">
    import './vars.css';
    import './app.css';
    import favicon from './assets/favicon.ico';
    import Controls from './components/Controls.svelte';
    import { onMount } from 'svelte';

    let color = true;
    let hasPrev = false;
    let hasNext = true;

    function toggleColor() {
        color = !color;
        if (color) document.documentElement.classList.remove( 'dark' );
        else document.documentElement.classList.add( 'dark' );
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

<div id="plant"></div>

<Controls
    {color} {hasPrev} {hasNext}

    on:toggleColor={toggleColor}
/>

<div id="tools" class="off">
    <div>
        <div>
            <span class=label id="genus"></span>
        </div>
        <div>
            <label class="gr" for="seed-input">Seed</label>
            <span id="seed" class="grow"></span>
            <span class="btn copy-seed gl">copy</span>
        </div>
        <div>
            <input class="grow" type="text" name="seed" id="seed-input">
            <span class="btn set-seed gl">set seed</span>
        </div>
        <div>
            <span class="btn copy-svg">copy svg to clipboard</span>
        </div>
    </div>
</div>

<style>

</style>
