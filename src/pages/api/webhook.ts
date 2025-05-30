import type { APIRoute } from 'astro';
import { createHmac, timingSafeEqual } from 'crypto';
import plainwhiteConfig from '../../plainwhite.config.ts';

type NotionUpdate = {
    entity: {
        id: string;
        type: string;
    };
};

const return200 = () =>
    new Response(JSON.stringify({ hello: 'world' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const POST: APIRoute = async ({ request, site }) => {
    const body = await request.json();

    const postedVerificationToken = body.verification_token;
    const { NOTION_VERIFICATION_TOKEN, CACHE_BYPASS_TOKEN } = plainwhiteConfig;

    if (postedVerificationToken) {
        if (NOTION_VERIFICATION_TOKEN !== postedVerificationToken) {
            console.log(
                `New notion token received: ${postedVerificationToken}, please update env vars`
            );
        } else {
            console.log(`Notion token verification request received`);
        }
        return return200();
    }

    const signature = request.headers.get('X-Notion-Signature');

    if (!signature) {
        console.log('Signature not present, ignoring the request');
        return return200();
    }
    const calculatedSignature = `sha256=${createHmac('sha256', NOTION_VERIFICATION_TOKEN).update(JSON.stringify(body)).digest('hex')}`;

    const isTrustedPayload = timingSafeEqual(
        Buffer.from(calculatedSignature),
        Buffer.from(signature)
    );

    if (!isTrustedPayload) {
        console.log('Payload verification failed, ignoring the request');
        return return200();
    }

    const notionUpdate: NotionUpdate = body;
    const pageId = notionUpdate.entity.id;
    // console.log(`revalidating index and page ${pageId}`);
    // const origin = site?.origin || '';
    // const urlsToUpdate = [
    //     origin,
    //     `${origin}/posts/${pageId}`,
    //     `${origin}/sitemap-index.xml`,
    //     `${origin}/sitemap-0.xml`,
    // ];

    // try {
    //     await Promise.all(
    //         urlsToUpdate.map((url) =>
    //             fetch(url, {
    //                 headers: { 'x-prerender-revalidate': CACHE_BYPASS_TOKEN },
    //             })
    //         )
    //     );
    // } catch (error) {
    //     console.error(error);
    // }

    return return200();
};
