import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsUUID } from 'class-validator';

import { IId } from '@common/models';

export class IdDTO implements IId {
  @IsUUID()
  @IsString()
  @ApiProperty()
  id: string;
}
