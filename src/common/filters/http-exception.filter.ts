import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

import { STATUS_CODES } from 'http';

import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = (exception.getResponse() as any) ?? {
      message: 'Something Went Wrong',
    };

    this.logger.error(error);

    const results = {
      statusCode: status,
      statusName: STATUS_CODES[status],
      ...error,
    };

    response.status(status).json(results);
  }
}
