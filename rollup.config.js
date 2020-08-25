import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import { eslint } from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import pkg from './package.json';

const banner = `/**!
 * A simple console logging utility
 * Released under MIT license
 * @author Sachin Singh <contactsachinsingh@gmail.com>
 * @version v${pkg.version}
 * @license MIT
 */`;

const defaultConfig = {
    input: 'src/index.ts',
    output: {
        file: 'dist/js/argonLogger.js',
        format: 'umd',
        name: 'ArgonLogger',
        sourcemap: true,
        banner
    },
    plugins: [
        json({
            namedExports: false,
            exclude: "node_modules/**"
        }),
        resolve({
            customResolveOptions: {
                moduleDirectory: "node_modules"
            }
        }),
        babel({
            exclude: "node_modules/**",
            extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts'],
            babelHelpers: 'bundled'
        }),
        commonjs({
            extensions: ['.js', '.ts']
        })
    ]
};

if (process.env.SERVE) {
    defaultConfig.plugins.push(
        serve({
            open: true,
            contentBase: ['dist'],
            host: 'localhost',
            port: '3030'
        }),
        livereload({
            watch: 'dist',
            verbose: false
        })
    );
}

const productionConfig = Object.assign({}, defaultConfig);
productionConfig.output = Object.assign({}, productionConfig.output, {
    file: 'dist/js/argonLogger.min.js',
    sourcemap: false
});
productionConfig.plugins = [...defaultConfig.plugins, terser()];
defaultConfig.plugins = [
    eslint({
        exclude: [
            'node_modules/**',
            'json/**'
        ],
        throwOnError: true
    }),
    ...defaultConfig.plugins
];

const configurations = [defaultConfig];
if (!process.env.SERVE) {
    configurations.push(productionConfig);
}

export default configurations;