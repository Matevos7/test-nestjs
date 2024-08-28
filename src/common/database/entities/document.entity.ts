import { Column, Entity } from 'typeorm';

import { DocumentStatus } from '@common/enums';

import { BaseEntity } from '../base';

@Entity()
export class Document extends BaseEntity {
  @Column({
    name: 'name',
    length: 50,
  })
  name: string;

  @Column({
    name: 'url',
    type: 'text',
  })
  url: string;

  @Column({
    name: 'path',
    type: 'text',
    nullable: true,
  })
  path: string;

  @Column({
    enum: DocumentStatus,
    type: 'enum',
    default: DocumentStatus.PENDING,
  })
  status: DocumentStatus;
}
