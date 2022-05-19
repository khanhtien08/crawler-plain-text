export class CrawlerResponseInterface {
    meta: {
        title: string;
        description?: string;
        image?: string;
        html?: string;
        date?: string;
        author_name?: string;
    };
    provider: string;
    url: string;
}
