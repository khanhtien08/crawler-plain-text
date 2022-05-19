import { Controller, Get, NotFoundException, Query } from '@nestjs/common';

import { CRAWLER_ROUTES } from '../routes';
import { CrawlerService } from './crawler.service';
import { CrawlerQuery } from './types/queries';

@Controller()
export class CrawlerController {
    constructor(private readonly crawler: CrawlerService) {}

    @Get(CRAWLER_ROUTES.CRAWLER)
    async crawl(@Query() { url }: CrawlerQuery) {
        if (process.env.NODE_ENV !== 'production') {
            return this.crawler.crawl(url);
        }

        throw new NotFoundException();
    }
}
