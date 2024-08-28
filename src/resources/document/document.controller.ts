import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import axios from 'axios';
import { Transactional } from 'typeorm-transactional';

import { KafkaService } from '@shared/kafka';

import { IdDTO, PaginationQueryDTO } from '@common/dtos';
import { Topic } from '@common/enums';
import { ArrayHelpers, ResponseManager } from '@common/helpers';
import { ERROR_MESSAGES } from '@common/messages';
import { IId } from '@common/models';

import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto';

@Controller('documents')
@ApiTags('Documents')
export class DocumentController {
  constructor(
    private readonly documentService: DocumentService,

    private readonly kafkaService: KafkaService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'This API aimed to create new document',
  })
  @ApiCreatedResponse({
    type: IdDTO,
  })
  @Transactional()
  async create(@Body() body: CreateDocumentDto): Promise<IId> {
    const { data } = await axios.get(body.url);

    if (!ArrayHelpers.isArrayOfObjects(data)) {
      throw ResponseManager.buildError(ERROR_MESSAGES.INVALID_DATA);
    }
    const { id } = await this.documentService.create(body);

    await this.kafkaService.produceMessage(id, Topic.FILE_CREATED, data);
    return {
      id,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'This API aimed to get the document by id',
  })
  async findOne(@Param('id') id: string) {
    return this.documentService.findOne({ id });
  }

  @Get()
  @ApiOperation({
    summary: 'This API aimed to get the documents',
  })
  async find(@Query() query: PaginationQueryDTO) {
    return this.documentService.findAll(query);
  }
}
