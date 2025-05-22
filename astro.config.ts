import { defineConfig } from 'astro/config';
import plainwhiteConfig from './src/plainwhite.config.ts';

import vercel from '@astrojs/vercel';

const {
    plainwhite: { host },
} = plainwhiteConfig;

// https://astro.build/config
export default defineConfig({
    site: host,
    output: 'server',
    adapter: vercel({ isr: { expiration: 60 * 2 } }),
});
