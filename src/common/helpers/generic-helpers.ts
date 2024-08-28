import { Logger } from '@nestjs/common';

export class GenericHelpers {
  static logger(name = 'Other'): Logger {
    return new Logger(name);
  }
}
