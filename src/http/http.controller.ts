import { ConfigService } from '@halonext/msgr-api-common';
import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { COMMON_ROUTES } from '../routes';

@ApiTags('hello')
@Controller()
export class HttpController {
    private readonly logger = new Logger(HttpController.name);

    constructor(private readonly configs: ConfigService) {}

    @Get(COMMON_ROUTES.STATUS)
    _status() {
        return {
            name: this.configs.get('service.name'),
            version: this.configs.package('version', 'unknown'),
            uri: this.configs.get('service.globalPrefix'),
        };
    }
}
