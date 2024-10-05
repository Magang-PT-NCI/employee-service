import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction, Send } from 'express';
import { LoggerUtil } from '../utils/logger.utils';

@Injectable()
export class HttpMiddleware implements NestMiddleware {
  private readonly logger = new LoggerUtil('HttpMiddleware');

  public use(req: Request, res: Response, next: NextFunction): void {
    const start: number = Date.now();
    this.logger.http(`${req.method} ${req.originalUrl}`);

    // Override res.json method for
    const send: Send = res.send;
    res.send = (body: any) => {
      this.logger.debug(`response body: `, body);
      return send.call(this, body);
    };

    res.on('finish', () => {
      const duration: number = Date.now() - start;
      this.logger.http(
        `${req.method} ${req.originalUrl} - ${res.statusCode} ${res.statusMessage} - ${duration}ms`,
      );
    });

    res.setHeader('Content-Type', 'application/json');
    next();
  }
}
