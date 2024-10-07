import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../services/prisma.service';
import { ApiKey } from '@prisma/client';
import { TokenPayload } from '../interfaces/auth.interfaces';
import { validateToken } from '../utils/common.utils';
import { LoggerUtil } from '../utils/logger.utils';

@Injectable()
export class ServiceAuthMiddleware implements NestMiddleware {
  private readonly logger = new LoggerUtil('ServiceAuthMiddleware');

  public constructor(private readonly prisma: PrismaService) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.get('X-API-KEY');
    const headerToken: string = req.get('Authorization');

    if (apiKey) {
      const verifiedApiKey: ApiKey = await this.prisma.getApiKey(apiKey);

      if (!verifiedApiKey) {
        throw new UnauthorizedException('api key tidak valid!');
      }
    } else if (headerToken) {
      if (!headerToken.toLowerCase().startsWith('bearer ')) {
        throw new BadRequestException('format token tidak valid!');
      }

      const token = headerToken.split(' ')[1];
      const verifiedToken: TokenPayload = validateToken(token);

      if (!verifiedToken) {
        throw new UnauthorizedException('token tidak valid!');
      }
    } else {
      throw new BadRequestException('api key atau token harus dikirimkan!');
    }

    next();
  }
}
