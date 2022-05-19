import { ConfigModule, ConfigService, SentryModule } from '@halonext/msgr-api-common';
import { CacheModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';

import { CrawlerModule } from '../crawler/crawler.module';
import { GifModule } from '../gif/gif.module';
import { CrawlerCacheInterceptor } from '../interceptors';
import { HttpController } from './http.controller';

@Module({
    imports: [
        ConfigModule,
        GifModule,
        CrawlerModule,
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configs: ConfigService) => ({
                store: redisStore,
                url: configs.get('cache.url'),
                ttl: configs.get('cache.ttl'),
            }),
            inject: [ConfigService],
        }),
        SentryModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                ...config.get('sentry'),
                release: config.get('service.name'),
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [{ provide: APP_INTERCEPTOR, useClass: CrawlerCacheInterceptor }],
    controllers: [HttpController],
})
export class HttpModule {}
