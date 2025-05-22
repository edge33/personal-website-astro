// src/pages/sitemap.xml.ts
import { getAllNotionPages } from '../notion.ts';

import config from '../plainwhite.config.ts';

const {
    plainwhite: { host },
} = config;

export async function GET() {
    const pages = await getAllNotionPages();
    const urls = pages.map(
        ({ id }) => `<url><loc>${host}/posts/${id}</loc></url>`
    );

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${host}</loc></url>
      ${urls.join('\n')}
      ${new Date().toString()}
    </urlset>`,
        {
            headers: {
                'Content-Type': 'application/xml',
            },
        }
    );
}
