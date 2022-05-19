import { ConfigService, MetaLogger } from '@halonext/msgr-api-common';
import { HttpService, Injectable } from '@nestjs/common';

import { providers } from '../providers';
import { OEMBED_PROVIDER_ENUMS } from './oembed.enums';
import { OembedResponseInterfaces } from './oembed.interfaces';

interface OembedProviderInterface {
    name: string;
    endpoints: string[];
    api: string;
}

@Injectable()
export class OembedService {
    private readonly logger = new MetaLogger(OembedService.name);

    private readonly FB_APP_ID: string;
    private readonly FB_CLIENT_TOKEN: string;

    constructor(private http: HttpService, private readonly configs: ConfigService) {
        this.FB_APP_ID = configs.get('facebook.app-id');
        this.FB_CLIENT_TOKEN = configs.get('facebook.client-token');
    }

    async getOEmbed(url: string): Promise<{ data: OembedResponseInterfaces; provider: string } | null> {
        const provider = this.findProvider(url);

        if (!provider || !provider?.name) {
            return null;
        }

        const endpoint = [
            OEMBED_PROVIDER_ENUMS.INSTAGRAM,
            OEMBED_PROVIDER_ENUMS.FACEBOOK,
        ].includes(provider.name as OEMBED_PROVIDER_ENUMS)
            ? `${provider.api}${url}&access_token=${this.FB_APP_ID}|${this.FB_CLIENT_TOKEN}`
            : `${provider.api}${url}`;

        this.logger._log('.getOEmbed', { url, provider: provider.name, endpoint });

        const { data } = await this.http.get(endpoint).toPromise();
        return { data, provider: provider.name };
    }

    private findProvider(url: string): OembedProviderInterface {
        return providers.find(({ endpoints }) => {
            return endpoints.some((endpoint) => url.match(new RegExp(endpoint.replace(/\*/g, '(.*)'), 'i')));
        });
    }
}
