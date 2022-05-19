import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { from, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { CrawlerService } from '../crawler/crawler.service';

@Controller()
export class CrawlerController {
    constructor(private readonly crawler: CrawlerService) {}

    @GrpcMethod('crawler', 'get')
    async get({ urls }: { urls: string[] }) {
        return from(urls).pipe(
            mergeMap((url) => this.crawler.crawl(url)),
            mergeMap((data) => of({ ...data, meta: JSON.stringify(data.meta) })),
        );
    }
}
