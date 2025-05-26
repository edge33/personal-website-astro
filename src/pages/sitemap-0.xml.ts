import type { APIRoute } from 'astro';
import { getAllNotionPages } from '../notion.ts';

export const GET: APIRoute = async ({ site }) => {
    const pages = await getAllNotionPages();
    const urls = pages.map(
        ({ id, lastEditedTime }) => `
        <url>
            <loc>${site}/posts/${id}</loc>
            <lastmod>${lastEditedTime}</lastmod>
        </url>`
    );

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>${site}</loc></url>
      ${urls.join('\n')}
      </urlset>`,
        {
            headers: {
                'Content-Type': 'application/xml',
            },
        }
    );
};

// ${new Date().toString()}
