import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const diff = process.hrtime(startAt);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(0);
      this.logger.warn(
        `${method} ${originalUrl} ${statusCode} ${ip} \x1b[33m+${responseTime}ms\x1b[0m`,
      );
    });

    next();
  }
}
