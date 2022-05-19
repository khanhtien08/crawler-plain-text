/* eslint-disable @typescript-eslint/no-var-requires */
import { MetaLogger } from '@halonext/msgr-api-common';
import { Injectable } from '@nestjs/common';
import got from 'got';

import { MetaScraperResponseInterfaces } from './meta-scraper.interfaces';

@Injectable()
export class MetaScraperService {
    private readonly logger = new MetaLogger(MetaScraperService.name);

    private metaScraper;

    constructor() {
        this.initScraper();
    }

    private initScraper(): void {
        if (!this.metaScraper) {
            this.metaScraper = require('metascraper')([
                require('metascraper-author')(),
                require('metascraper-date')(),
                require('metascraper-description')(),
                require('metascraper-image')(),
                require('metascraper-video')(),
                require('metascraper-logo')(),
                require('metascraper-clearbit')(),
                require('metascraper-publisher')(),
                require('metascraper-title')(),
                require('metascraper-url')(),
            ]);
        }
    }

    async scrap(targetUrl: string): Promise<MetaScraperResponseInterfaces> {
        this.logger._log('.scrap', { targetUrl });
        const { body: html, url } = await got(targetUrl);
        return this.metaScraper({ html, url });
    }
}
