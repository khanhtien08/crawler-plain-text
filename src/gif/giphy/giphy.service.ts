import { ConfigService, MetaLogger } from '@halonext/msgr-api-common';
import { HttpService, Injectable } from '@nestjs/common';
import { stringify } from 'querystring';

@Injectable()
export class GiphyService {
    private readonly API_BASE: string;
    private readonly API_KEY: string;

    private readonly logger = new MetaLogger(GiphyService.name);

    constructor(private readonly config: ConfigService, private readonly http: HttpService) {
        this.API_BASE = this.config.get('crawler.giphy.base_url');
        this.API_KEY = this.config.get('crawler.giphy.token');
    }

    private filter(item) {
        return item.images?.preview_gif && item.images?.preview && item.images?.original;
    }

    private map(item) {
        return {
            id: item.id,
            originalUrl: item.url,
            provider: 'giphy',
            gif: {
                preview: item.images.preview_gif.url,
                url: item.images.original.url,
                dims: [parseInt(item.images.original.width), parseInt(item.images.original.height)],
                size: parseInt(item.images.original.size),
            },
            mp4: {
                preview: item.images.preview.mp4,
                url: item.images.original.mp4,
                dims: [parseInt(item.images.original.width), parseInt(item.images.original.height)],
                size: parseInt(item.images.original.mp4_size),
            },
        };
    }

    private getEndpoint(path: string, params: { [key: string]: string | number } = null) {
        const query = stringify({
            ...params,
            api_key: this.API_KEY,
        });

        return `${this.API_BASE}/${path}?${query}`;
    }

    async categories() {
        const endpoint = this.getEndpoint('categories');
        this.logger._verbose(`.categories`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.data.map((item) => {
            return {
                name: item.name,
                mediaUrl: item.gif.images.original.url,
                provider: 'giphy',
            };
        });
    }

    async search(q: string, limit = 20, offset = 0) {
        const endpoint = this.getEndpoint('search', { q, offset, limit });
        this.logger._verbose(`.search`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.data.filter(this.filter).map(this.map);
    }

    async trending(limit = 20, offset = 0) {
        const endpoint = this.getEndpoint('trending', { offset, limit });
        this.logger._verbose(`.trending`, { endpoint });

        const { data } = await this.http.get(endpoint).toPromise();

        return data.data.filter(this.filter).map(this.map);
    }
}
