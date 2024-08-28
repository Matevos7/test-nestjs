import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';

import { Document } from '@common/database/entities';
import { DocumentStatus } from '@common/enums';
import { IPagination } from '@common/models';
import { ICreateDocument } from '@common/models/document';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly _documentsRepository: Repository<Document>,
  ) {}

  /**
   * This method aimed create new document.
   * @param {ICreateDocument} body
   * @returns {Document}
   */
  async create(body: ICreateDocument): Promise<Document> {
    const document = await this._documentsRepository.save(body);
    return document;
  }

  /**
   * This method aimed to get all documents.
   * @param {IPagination} pagination
   * @param {FindOptionsWhere<Document> | FindOptionsWhere<Document>[]} query // Default: {}
   * @returns {Document[]}
   */
  async findAll(
    pagination: IPagination,
    query: FindOptionsWhere<Document> | FindOptionsWhere<Document>[] = {},
  ): Promise<Document[]> {
    return this._documentsRepository.find({
      where: query,
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  /**
   * This method aimed to get the pending documents.
   * @param {IPagination} pagination
   * @returns {Document[]}
   */
  async findPendingDocuments(pagination: IPagination): Promise<Document[]> {
    return this._documentsRepository
      .createQueryBuilder('documents')
      .where('status =:status', { status: DocumentStatus.PENDING })
      .andWhere(`created_at < now()::timestamp - INTERVAL '10 min'`)
      .skip(pagination.offset)
      .take(pagination.limit)
      .getMany();
  }

  /**
   * This method aimed to get all documents.
   * @param {Partial<Document>} query
   * @param {FindOptionsWhere<Document> | FindOptionsWhere<Document>[]} query
   * @returns {string}
   */
  async findOne(
    query: FindOptionsWhere<Document> | FindOptionsWhere<Document>[],
  ): Promise<Document> {
    return this._documentsRepository.findOne({
      where: query,
    });
  }

  /**
   * This method aimed to update the document by id.
   * @param {string} id
   * @returns {Partial<Document>}
   */
  async update(id: string, data: Partial<Document>): Promise<void> {
    await this._documentsRepository.update(id, data);
  }
}
