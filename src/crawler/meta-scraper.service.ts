/* eslint-disable @typescript-eslint/no-var-requires */
import { MetaLogger } from '@halonext/msgr-api-common';
import { Injectable } from '@nestjs/common';

import { MetaScraperResponseInterfaces } from './meta-scraper.interfaces';
const puppeteer = require('puppeteer');

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
        const browser = await puppeteer.launch({
            timeout: 5000,
        });
        const page = await browser.newPage();
        await page.goto(targetUrl, { waitUntil: 'networkidle0' });
        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        return this.metaScraper({ url: targetUrl, html: data });
    }
}
