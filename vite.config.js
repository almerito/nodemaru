import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import fs from 'fs';
import path from 'path';

const copyAssetsPlugin = () => ({
    name: 'copy-assets',
    buildStart() {
        const src = path.resolve(__dirname, 'resources/assets');
        const dest = path.resolve(__dirname, 'public/assets/defaults');

        if (fs.existsSync(src)) {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            // Use cpSync (Node 16.7+)
            fs.cpSync(src, dest, { recursive: true, force: true });
            console.log('✓ Copied default assets to public/assets/defaults');
        }
    }
});

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.scss', 'resources/js/app.js'],
            refresh: true,
        }),
        copyAssetsPlugin(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function', 'mixed-decls'],
            },
        },
    },
});
