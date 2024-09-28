import { Client } from '@notionhq/client';
import plainwhiteConfig from './plainwhite.config';
import { NotionToMarkdown } from 'notion-to-md';
import { marked, Marked } from 'marked';
import markedShiki from 'marked-shiki';
import { getSingletonHighlighter } from 'shiki';
import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel,
    transformerMetaHighlight,
    transformerMetaWordHighlight,
} from '@shikijs/transformers';
import type { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type NotionPageResponse = {
    pages: NotionPage[];
    hasMore: boolean;
    nextPageCursor: string | null;
};

export type NotionPage = {
    id: string;
    title: string;
    slug: string;
    date: string;
    categories: string[];
    excerpt: string;
};

interface TextObject {
    type: string;
    text: { content: string };
    annotations: object;
    plain_text: string;
    href: string | null;
}

const renderer = new marked.Renderer();
renderer.link = function (href) {
    return `<a target="_blank" href="${href.href}">${href.text}` + '</a>';
};

const highlighter = await getSingletonHighlighter({
    // In this case, we include the "js" language specifier to ensure that
    // Shiki applies the appropriate syntax highlighting for Markdown code
    // blocks.
    langs: ['md', 'js', 'lua'],

    themes: ['solarized-dark', 'solarized-light'],
});

const mapPageData = (notionResponse: DatabaseObjectResponse): NotionPage => {
    const { id, properties: properties_ } = notionResponse;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const properties = properties_ as any;

    return {
        id: id,
        title: properties.Title.title[0].text.content,
        slug: properties.Slug.rich_text[0].plain_text,
        date: properties.Date.created_time,
        categories: properties.Tags.multi_select.map(
            ({ name }: { name: string }) => name
        ),
        excerpt: convertToHtml(properties.Excerpt.rich_text),
    };
};

function convertToHtml(textObjects: TextObject[]): string {
    return textObjects
        .map((obj) => {
            if (obj.href) {
                // If the object has a link, wrap the plain_text in an anchor tag
                return `<a href="${obj.href}" target="_blank">${obj.plain_text}</a>`;
            } else {
                // Otherwise, just return the plain_text
                return obj.plain_text;
            }
        })
        .join(''); // Join all parts into a single string
}

const { NOTION_CONTENT_DATABASE_ID, NOTION_TOKEN } = plainwhiteConfig;

const notion = new Client({ auth: NOTION_TOKEN });

const n2m = new NotionToMarkdown({ notionClient: notion });

export async function getPosts({
    currentPageCursor,
}: {
    currentPageCursor: string | null;
}): Promise<NotionPageResponse> {
    const notionPages = await notion.databases.query({
        database_id: NOTION_CONTENT_DATABASE_ID,
        filter: { property: 'Published', checkbox: { equals: true } },

        ...(currentPageCursor ? { start_cursor: currentPageCursor } : {}),
        page_size: 1,
    });

    const pages = notionPages.results.map((r) =>
        mapPageData(r as DatabaseObjectResponse)
    );

    return {
        pages,
        hasMore: notionPages.has_more,
        nextPageCursor: notionPages.next_cursor,
    };
}

export const getNotionPage = async (pageId: string) => {
    try {
        const pageDataQueryResult = await notion.pages.retrieve({
            page_id: pageId,
        });

        const pageData = mapPageData(
            pageDataQueryResult as unknown as DatabaseObjectResponse
        );

        const mdblocks = await n2m.pageToMarkdown(pageId);

        const mdString = n2m.toMarkdownString(mdblocks);

        const marked = new Marked().use(
            markedShiki({
                highlight(code, lang, props) {
                    return highlighter.codeToHtml(code, {
                        lang,
                        themes: {
                            light: 'solarized-light',
                            dark: 'solarized-dark',
                        },
                        meta: { __raw: props.join(' ') }, // required by `transformerMeta*`
                        transformers: [
                            transformerNotationDiff(),
                            transformerNotationHighlight(),
                            transformerNotationWordHighlight(),
                            transformerNotationFocus(),
                            transformerNotationErrorLevel(),
                            transformerMetaHighlight(),
                            transformerMetaWordHighlight(),
                        ],
                    });
                },
            })
        );

        const html = await marked.parse(mdString.parent, { renderer });

        return { html, pageProp: pageData };
    } catch (err) {
        console.log(err);
    }

    return null;
};
