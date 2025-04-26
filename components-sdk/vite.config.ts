// @ts-ignore
import react from '@vitejs/plugin-react';
// @ts-ignore
import path from 'node:path';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [
        react({
          jsxRuntime: 'classic',
        }),
        dts({
            insertTypesEntry: true,
        })
    ],
    build: {
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'components-sdk',
            formats: ['es', 'umd'],
            fileName: format => `components-sdk.${format}.js`
        },
        rollupOptions: {
            external: (source) => {
                if(source.startsWith("/") || source.startsWith(".")) return null;
                return true;
            },
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM'
                },
            },
        },
    },
    css: {
        postcss: {
            plugins: [
                postcssNesting
            ],
        },
    },
});
