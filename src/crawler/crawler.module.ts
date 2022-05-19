import { HttpModule, Module } from '@nestjs/common';

import { CrawlerController } from './crawler.controller';
import { CrawlerService } from './crawler.service';
import { MetaScraperService } from './meta-scraper.service';
import { OembedService } from './oembed.service';

@Module({
    imports: [HttpModule],
    providers: [MetaScraperService, OembedService, CrawlerService],
    controllers: [CrawlerController],
    exports: [CrawlerService],
})
export class CrawlerModule {}
