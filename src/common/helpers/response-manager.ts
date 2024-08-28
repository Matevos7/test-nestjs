import { HttpException, HttpStatus } from '@nestjs/common';

import { ValidationError } from 'class-validator';
import { snakeCase } from 'lodash';

import {
  IValidationErrors,
  IMessageResponse,
  IValidationErrorsResponse,
} from '@common/models';

export class ResponseManager {
  static buildError(
    error: IMessageResponse | IValidationErrorsResponse = null,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    throw new HttpException(error, status);
  }

  static validationHandler(
    errors: ValidationError[],
    prop: string = null,
  ): IValidationErrors[] {
    const parentProp = prop ? `${snakeCase(prop)}.` : '';
    const errorResponse: IValidationErrors[] = [];

    for (const e of errors) {
      if (e.constraints) {
        const constraintKeys = Object.keys(e.constraints);
        for (const item of constraintKeys) {
          errorResponse.push({
            field: e.property,
            message: `err_${parentProp}${e.property.toLowerCase()}_${snakeCase(
              item,
            )}`,
          });
        }
      }
    }

    return errorResponse;
  }
}
