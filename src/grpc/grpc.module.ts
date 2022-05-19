import { ConfigModule, ConfigService } from '@halonext/msgr-api-common';
import { CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

import { CrawlerModule } from '../crawler/crawler.module';
import { CrawlerCacheInterceptor } from '../interceptors';
import { CrawlerController } from './crawler.controller';

@Module({
    imports: [
        ConfigModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configs: ConfigService) => ({
                store: redisStore,
                url: configs.get('cache.url'),
                ttl: configs.get('cache.ttl'),
            }),
            inject: [ConfigService],
        }),
        CrawlerModule,
    ],
    providers: [{ provide: APP_INTERCEPTOR, useClass: CrawlerCacheInterceptor }],
    controllers: [CrawlerController],
})
export class GrpcModule {}
