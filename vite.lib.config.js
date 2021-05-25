import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ svelte() ],
    publicDir: false,
    build: {
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'svg-plant'
        },
    },
});
