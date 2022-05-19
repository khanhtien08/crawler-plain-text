import { MetaLogger } from '@halonext/msgr-api-common';
import { CacheInterceptor, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CrawlerCacheInterceptor extends CacheInterceptor {
    private readonly logger = new MetaLogger(CrawlerCacheInterceptor.name);

    trackBy(context: ExecutionContext): string | undefined {
        const type = context.getType();

        switch (type) {
            // case 'http':
            //     const httpKey = super.trackBy(context);
            //     this.logger._debug(`.trackBy: fetching from cache`, { key: httpKey });
            //     return httpKey;
            case 'rpc':
                const rpcKey = `${context.getClass().name}-${context.getHandler().name}-${JSON.stringify(
                    context.getArgByIndex(0),
                )}`;
                this.logger._debug(`.trackBy: fetching from cache`, { key: rpcKey });
                return rpcKey;
        }
    }
}
