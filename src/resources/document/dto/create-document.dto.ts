import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'test',
  })
  name: string;

  @IsUrl()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'https://api.binance.com/api/v3/ticker/price',
  })
  url: string;
}
