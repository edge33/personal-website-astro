import type { APIRoute } from 'astro';
import plainwhiteConfig from '../../plainwhite.config.ts';

// const return404 = () => {
//     return new Response(null, {
//         status: 404,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
// };

const return200 = () =>
    new Response(JSON.stringify({ hello: 'world' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

export const POST: APIRoute = async ({ request }) => {
    const body = await request.json();
    console.log('incoming request', { body });

    const postedVerificationToken = body.verification_token;
    console.log('incoming request', { postedVerificationToken });
    const { NOTION_VERIFICATION_TOKEN } = plainwhiteConfig;

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

    return return200();
};
