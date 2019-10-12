import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import execute from 'rollup-plugin-execute';
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import autoPreprocess from 'svelte-preprocess';

const isProd = !process.env.ROLLUP_WATCH;

function bundle(file, format, name) {
  return {
    file: file,
    format: format,
    name: name,
    sourcemap: !isProd,
  };
}

export default {
  input: isProd ? 'src/index.js' : 'example/src/main.js',
  output: isProd ? [
    bundle('dist/svelt-routr.js', 'cjs', 'svelte-routr'),
    bundle('dist/svelt-routr.es.js', 'es', 'svelte-routr'),
    bundle('dist/svelt-routr.min.js', 'umd', 'svelte-routr'),
  ] : bundle('example/dist/bundle.js', 'iife', 'example'),
  external: isProd ? ['svelte'] : [],
  plugins: [
    execute(isProd ? [] : [
      'node-sass -q example/src/global.scss example/dist/global.css'
    ]),

    svelte({
      dev: !isProd,
      preprocess: autoPreprocess()
    }),

    resolve({
      browser: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/')
    }),

    commonjs(),

    copy({
      targets: isProd ? [] : [
        { src: 'example/src/index.html', dest: 'example/dist' },
        { src: 'example/src/favicon.png', dest: 'example/dist' }
      ]
    }),

    !isProd && livereload('example/dist'),
    isProd && terser()
  ],
  watch: {
    clearScreen: false
  }
};
