import { Injectable } from '@nestjs/common';

import { MetaScraperService } from './meta-scraper.service';
import { OembedService } from './oembed.service';
import { CrawlerResponseInterface } from './types/response';

@Injectable()
export class CrawlerService {
    constructor(private readonly oembed: OembedService, private readonly metaScraper: MetaScraperService) {}

    async crawl(url: string): Promise<CrawlerResponseInterface> {
        const embed = await this.oembed.getOEmbed(url);

        if (embed) {
            const { data, provider } = embed;
            const meta = {
                title: data.title,
                description: null,
                author_name: data.author_name,
                image: data.thumbnail_url,
                date: null,
                html: data.html,
            };

            return {
                meta,
                provider,
                url,
            };
        }

        const res = await this.metaScraper.scrap(url);
        const meta = {
            title: res.title,
            description: res.description,
            image: res.image,
            date: res.date,
            author_name: res.author,
        };

        return {
            meta,
            provider: 'unknown',
            url,
        };
    }
}
