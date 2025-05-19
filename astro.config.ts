import { defineConfig } from 'astro/config';
import plainwhiteConfig from './src/plainwhite.config.ts';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel';

const {
    plainwhite: { sitemap: enableSitemap },
} = plainwhiteConfig;

// https://astro.build/config
export default defineConfig({
    site: 'https://efem.dev',
    ...(enableSitemap ? { integrations: [sitemap()] } : {}),
    output: 'server',
    adapter: vercel({ isr: { expiration: 60 * 2 } }),
});
