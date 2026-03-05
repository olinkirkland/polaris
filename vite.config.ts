import { URL, fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    return {
        plugins: [vue(), tailwindcss()],
        server: { host: false }, // For external IP access
        base: mode === 'development' ? '/' : '/polaris',
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});
