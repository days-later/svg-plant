
import { eslint } from "rollup-plugin-eslint";
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import del from 'rollup-plugin-delete';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const isProduction = process.env.NODE_ENV == 'production';

const bubleCfg = {
    exclude: [ 'node_modules/**' ],
    transforms: { dangerousForOf: true },
    objectAssign: 'Object.assign',
};

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js',
        output: {
            name: 'SvgPlant',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            del({ targets: 'dist/*' }),

            resolve(),
            commonjs(),
            buble( bubleCfg ),
            isProduction && terser(),
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    {
        input: 'src/main.js',
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        plugins: [
            buble( bubleCfg ),
        ],
        external: Object.keys( pkg.dependencies ),
    },

    // src: unminified, untranspiled
    {
        input: 'src/main.js',
        output: {
            file: pkg.src,
            format: 'es'
        },
        plugins: [
            eslint({
                exclude: 'node_modules/**',
                throwOnError: true,
                throwOnWarning: true,
                formatter: 'table',
            }),
        ],
        external: Object.keys( pkg.dependencies ),
    },
];