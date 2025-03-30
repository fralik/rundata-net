// rollup.config.mjs
import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'rundatanet/runes/js/index.js',
    output: [
      {
        file: 'rundatanet/static/runes/index.js',
        format: 'iife'
      },
      {
        file: 'rundatanet/static/runes/index.min.js',
        format: 'iife',
        sourcemap: true,
        plugins: [terser()]
      }
    ]
  },
  {
    input: 'rundatanet/runes/js/export.worker.js',
    output: [
      {
        file: 'rundatanet/static/runes/export.worker.js',
        format: 'iife'
      },
      {
        file: 'rundatanet/static/runes/export.worker.min.js',
        format: 'iife',
        sourcemap: true,
        plugins: [terser()]
      }
    ]
  }
];