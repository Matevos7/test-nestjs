/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware } from '@nestjs/common';

import { getClientIp } from 'request-ip';

import { GenericHelpers } from '@common/helpers';

const logger = GenericHelpers.logger('IpMiddleware');

@Injectable()
export class IpMiddleware implements NestMiddleware {
  async use(
    req: Request & { userIpAddress: string },
    _res: Response,
    next: () => void,
  ) {
    try {
      req.userIpAddress = getClientIp(req.headers as any);
    } catch (error) {
      logger.warn(error);
    }
    next();
  }
}
