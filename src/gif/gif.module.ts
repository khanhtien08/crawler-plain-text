import { HttpModule, Module } from '@nestjs/common';

import { GifController } from './gif.controller';
import { GiphyService } from './giphy/giphy.service';
import { TenorService } from './tenor/tenor.service';

@Module({
    imports: [HttpModule],
    controllers: [GifController],
    providers: [TenorService, GiphyService],
    exports: [TenorService, GiphyService],
})
export class GifModule {}
