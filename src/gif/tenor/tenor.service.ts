import { ConfigService, MetaLogger } from '@halonext/msgr-api-common';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { stringify } from 'querystring';

@Injectable()
export class TenorService {
    private readonly API_KEY: string;
    private readonly API_BASE: string;
    private readonly LOCALE: string;

    private readonly logger = new MetaLogger(TenorService.name);

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.API_KEY = this.config.get('crawler.tenor.token');
        this.API_BASE = this.config.get('crawler.tenor.base_url', 'https://api.tenor.com/v1');
    }

    private mapObject(item) {
        const gif = item.media[0].gif;
        const { duration, ...mp4 } = item.media[0].mp4;

        return {
            id: item.id,
            originalUrl: item.url,
            provider: 'tenor',
            gif,
            mp4,
        };
    }

    private getEndpoint(path: string, params: { [key: string]: string | number } = null) {
        // TODO: use user locale
        const query = stringify({
            ...params,
            key: this.API_KEY,
            locale: this.LOCALE,
            media_filter: 'minimal',
        });

        return `${this.API_BASE}/${path}?${query}`;
    }

    async categories() {
        const endpoint = this.getEndpoint('categories');
        this.logger._verbose(`.categories`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.tags.map((item) => {
            return {
                name: item.searchterm,
                mediaUrl: item.image,
                provider: 'tenor',
            };
        });
    }

    async search(q: string, limit: number, pos: number) {
        const endpoint = this.getEndpoint('search', { q, limit, pos });
        this.logger._verbose(`.search`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.results.map((item) => this.mapObject(item));
    }

    async trending(limit = 20, pos = 0) {
        const endpoint = this.getEndpoint('trending', { limit });
        this.logger._verbose(`.trending`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.results.map((item) => this.mapObject(item));
    }
}
