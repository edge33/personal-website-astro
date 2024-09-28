export default {
    title: 'Your awesome title',
    author: 'GitHub User',
    email: 'your-email@domain.com',
    description:
        'Write an awesome description for your new site here. You can edit this line in _config.yml. It will appear in your document head meta (for Google search results) and in your feed.xml site description.\n',
    show_excerpts: true,

    NOTION_TOKEN: import.meta.env.NOTION_TOKEN,
    NOTION_CONTENT_DATABASE_ID: import.meta.env.NOTION_CONTENT_DATABASE_ID,

    plainwhite: {
        name: 'Adam Denisov',
        tagline: 'Developer. Designer',
        date_locale: 'en-UK',
        date_format: {
            day: 'numeric' as const,
            year: 'numeric' as const,
            month: 'short' as const,
        },
        sitemap: true, // set to true to generate sitemap.xml content
        search: false, // set to true to enable     searchbar
        dark_mode: true, // set to true to add dark mode toggle
        portfolio_image: 'assets/portfolio.webp', // the path from the base directory of the site to the image to display (no / at the start)
        portfolio_image_dark: '',
        html_lang: 'en', // set the lang attribute of the <html> tag for the pages. See here for a list of codes: https://www.w3schools.com/tags/ref_country_codes.asp
        condensed_mobile: ['page', 'post'],
        analytics_id: undefined,
        disqus_shortname: undefined,
        social_links: {
            twitter: 'samarsault',
            github: 'samarsault',
            linkedIn: 'in/samarsault',
            // dribbble: 'samarsault',
            // flickr: 'samarsault',
            instagram: 'samarsault',
            // pinterest: 'samarsault',
            // youtube: 'samarsault',
            // facebook: 'samarsault',
            // soundcloud: 'samarsault',
            // telegram: 'samarsault',
            // gitlab: 'samarsault',
            // email: 'samarsault',
            // stackoverflow: 'samarsault',
        },
        // mastodon: [
        //     { username: "jekyll", instance: "example.com" }
        // ]

        // navigation: [
        //     { title: 'My Work', url: '/my-work' },
        //     { title: 'Resume', url: '/resume' },
        // ],
    },
};
