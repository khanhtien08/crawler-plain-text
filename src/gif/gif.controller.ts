import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

import { CRAWLER_ROUTES } from '../routes';
import { GiphyService } from './giphy/giphy.service';
import { TenorService } from './tenor/tenor.service';

@ApiBearerAuth()
@ApiTags('GIFs')
@Controller(CRAWLER_ROUTES.GIF)
export class GifController {
    constructor(private readonly tenor: TenorService, private readonly giphy: GiphyService) {}

    @Get('trending')
    async trending(@Query('limit') limit = 20, @Query('pos') pos = 0) {
        // const tenor = await this.tenor.trending(limit, pos);
        const giphy = await this.giphy.trending(limit, pos);

        return [...giphy];
    }

    @Get('categories')
    async categories() {
        // const tenor = await this.tenor.categories();
        const giphy = await this.giphy.categories();

        return [...giphy];
    }

    @ApiQuery({
        type: 'string',
        name: 'q',
        example: 'cry cute',
        description: 'Search by keywords',
    })
    @Get('search')
    async search(@Query('q') q: string, @Query('limit') limit = 20, @Query('pos') pos = 0) {
        // const tenor = await this.tenor.search(q, limit, pos);
        const giphy = await this.giphy.search(q, limit, pos);

        return [...giphy];
    }
}
