import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class CrawlerQuery {
    @ApiProperty({
    })
    @IsNotEmpty()
    @IsUrl()
    @Transform((params) => params.value.trim())
    url: string;
}
