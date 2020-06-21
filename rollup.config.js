import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import del from 'rollup-plugin-delete';
import { terser } from "rollup-plugin-terser";
import pkg from './package.json';

const isProduction = (process.env.NODE_ENV||'').trim() == 'production';

const input = "src/main.ts";
const extensions = [ '.js', '.ts' ];

export default [
    // browser-friendly UMD build
    {
        input,
        output: {
            name: 'SvgPlant',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            del({ targets: 'dist/*.(js|map)' }),

            resolve({ extensions }),
            commonjs(),

            babel({
                extensions,
                babelHelpers: 'runtime',
                include: [ 'src/**/*' ],
            }),

            isProduction && terser(),
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    {
        input,
        output: [
            { file: pkg.main, format: 'cjs', sourcemap: true },
            { file: pkg.module, format: 'es', sourcemap: true }
        ],
        plugins: [
            resolve({ extensions }),
            commonjs(),
            babel({
                extensions,
                babelHelpers: 'runtime',
                include: [ 'src/**/*' ],
            }),
        ],
        external: Object.keys( pkg.dependencies ),
    },
];