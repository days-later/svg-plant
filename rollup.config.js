
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
        external: [
            'random-seed'
        ],
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        external: Object.keys( pkg.dependencies ),
        plugins: [
            buble( bubleCfg ),
            isProduction && terser(),
        ]
    },

    // src: unminified, untranspiled
    {
        input: 'src/main.js',
        external: Object.keys( pkg.dependencies ),
        output: {
            file: pkg.src,
            format: 'es'
        }
    }
];