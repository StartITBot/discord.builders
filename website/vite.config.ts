import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import postcssNesting from 'postcss-nesting';

export default defineConfig(({ command, mode }) => ({
    plugins: [
        react({
            jsxRuntime: 'classic',
        }),
    ],

    esbuild: {
        jsxInject: `import React from 'react'`,
    },
    resolve:
        command === 'serve' && mode === 'development'
            ? {
                  // Make library auto-reload only on yarn dev
                  alias: [
                      // .* is to not double import css files
                      { find: /^components-sdk.*$/, replacement: resolve(__dirname, '../components-sdk/src') },
                  ],
              }
            : undefined,
    css: {
        postcss: {
            plugins: [postcssNesting],
        },
    },
}));
