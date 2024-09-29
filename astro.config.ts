import { defineConfig } from 'astro/config';
import plainwhiteConfig from './src/plainwhite.config';
import sitemap from '@astrojs/sitemap';

import vercel from '@astrojs/vercel/serverless';

const {
    plainwhite: { sitemap: enableSitemap },
} = plainwhiteConfig;

// https://astro.build/config
export default defineConfig({
    site: 'https://efem.dev',

    // integrations: [sitemap()],
    // integrations: [sitemap()],
    ...(enableSitemap ? { integrations: [sitemap()] } : {}),

    output: 'server',
    adapter: vercel({ isr: { expiration: 60 * 60 } }),
});
