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
    input: 'rundatanet/runes/js/search_core_entry.js',
    output: [
      {
        file: 'rundatanet/static/runes/search_core.js',
        format: 'iife'
      },
      {
        file: 'rundatanet/static/runes/search_core.min.js',
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
