import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    const posts: {
        slug: string;
        body: string;
        data: {
            title: string;
            subTitle: string;
            categories: string[];
            date: string;
            tags: string[];
        };
    }[] = [];

    const json = JSON.stringify(
        posts.map(
            ({
                slug,
                body,
                data: { title, subTitle = '', categories, date, tags = [] },
            }) => ({
                title: title,
                'title-lower': subTitle,
                'sub-title': subTitle,
                'sub-title-lower': subTitle.toLowerCase(),
                categories,
                tags: tags.join(', '),
                url: `/${slug}`,
                date,
                content: body.replace(/<[^>]*>/g, '').slice(200),
            })
        )
    );

    return new Response(json, {
        headers: { 'Content-Type': 'application/json' },
    });
};
