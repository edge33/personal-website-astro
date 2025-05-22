import { defineConfig } from 'astro/config';
import plainwhiteConfig from './src/plainwhite.config.ts';
import { loadEnv } from 'vite';

const { CACHE_DURATION, CACHE_BYPASS_TOKEN } = loadEnv(
    process.env.NODE_ENV as string,
    process.cwd(),
    ''
);

import vercel from '@astrojs/vercel';

const {
    plainwhite: { host },
} = plainwhiteConfig;

// https://astro.build/config
export default defineConfig({
    site: host,
    output: 'server',
    adapter: vercel({
        isr: {
            expiration: Number(CACHE_DURATION) || 60 * 62 * 24,
            bypassToken: CACHE_BYPASS_TOKEN,
        },
    }),
});
