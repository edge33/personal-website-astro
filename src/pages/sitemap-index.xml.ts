// src/pages/sitemap.xml.ts
import { getAllNotionPages } from '../notion.ts';

import config from '../plainwhite.config.ts';

const {
    plainwhite: { host },
} = config;

export async function GET() {
    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
            <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <sitemap>
                    <loc>${host}/sitemap-0.xml</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                </sitemap>
            </sitemapindex>`,
        {
            headers: {
                'Content-Type': 'application/xml',
            },
        }
    );
}

// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     <url><loc>${host}</loc></url>
//   ${urls.join('\n')}
//   ${new Date().toString()}
// </urlset>`,
//     {
//         headers: {
//             'Content-Type': 'application/xml',
//         },
//     }
// );
