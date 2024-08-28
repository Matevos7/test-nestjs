import { ApiProperty } from '@nestjs/swagger';

import { IsNumber } from 'class-validator';

import { IPagination } from '@common/models';

export class PaginationQueryDTO implements IPagination {
  @ApiProperty()
  @IsNumber()
  offset = 0;

  @ApiProperty()
  @IsNumber()
  limit = 100;
}
