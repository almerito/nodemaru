import { defineConfig } from 'vite';
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';

// Custom plugin to copy files after build
const copyPlugin = () => ({
    name: 'copy-files',
    closeBundle() {
        const distDir = resolve(__dirname, 'dist');

        // Copy api folder
        if (existsSync('api')) {
            cpSync('api', resolve(distDir, 'api'), { recursive: true });
            console.log('✓ Copied api/ to dist/api/');
        }

        // Copy help.html
        if (existsSync('help.html')) {
            copyFileSync('help.html', resolve(distDir, 'help.html'));
            console.log('✓ Copied help.html to dist/');
        }

        // Copy credits.html
        if (existsSync('credits.html')) {
            copyFileSync('credits.html', resolve(distDir, 'credits.html'));
            console.log('✓ Copied credits.html to dist/');
        }

        // Copy pages.css
        if (existsSync('pages.css')) {
            copyFileSync('pages.css', resolve(distDir, 'pages.css'));
            console.log('✓ Copied pages.css to dist/');
        }

        // Copy shaders folder
        if (existsSync('shaders')) {
            cpSync('shaders', resolve(distDir, 'shaders'), { recursive: true });
            console.log('✓ Copied shaders/ to dist/shaders/');
        }

        // Copy images folder
        if (existsSync('images')) {
            cpSync('images', resolve(distDir, 'images'), { recursive: true });
            console.log('✓ Copied images/ to dist/images/');
        }
    }
});

export default defineConfig({
    base: './',
    plugins: [copyPlugin()]
});
