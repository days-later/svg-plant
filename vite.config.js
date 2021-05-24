import { defineConfig } from 'vite'
import svelte from '@sveltejs/vite-plugin-svelte'
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [ svelte() ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'lib/main.ts'),
            name: 'svg-plant'
        },
    },
})
