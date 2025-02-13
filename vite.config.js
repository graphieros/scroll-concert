import { copyFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { rm } from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            name: 'scroll-concert',
            fileName: 'scroll-concert',
        },
        rollupOptions: {
        },
    },
    test: {
        environment: 'jsdom',
    },
    plugins: [
        dts({
            insertTypesEntry: true,
            skipDiagnostics: false,
            include: ['src/scroll-concert.ts'],
        }),
        {
            name: 'copy-readme',
            apply: 'build',
            generateBundle() {
                const src = resolve(__dirname, 'README.md');
                const dest = resolve(__dirname, 'dist/README.md');
                copyFileSync(src, dest);
                console.log('README.md copied to dist folder');
            },
        },
        {
            name: 'nuke-type-f-folder',
            apply: 'build',
            async generateBundle() {
                const typesDir = resolve(__dirname, 'dist/types');
                try {
                    await rm(typesDir, { recursive: true, force: true });
                    console.log('Types folder removed from dist.');
                } catch (error) {
                    console.error('Error removing types folder:', error);
                }
            },
        },
    ]
})