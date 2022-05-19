import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CrawlerQuery {
    @ApiProperty({
        type: 'string',
        name: 'url',
        example: 'https://hahalolo.com',
    })
    @IsNotEmpty()
    @IsUrl()
    @Transform((params) => params.value.trim())
    url: string;
}
