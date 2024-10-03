import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ServiceAuthUtils } from '../utils/service-auth.utils';
import { TokenPayload } from '../types/auth.types';

@Injectable()
export class ServiceAuthMiddleware implements NestMiddleware {
  public async use(req: Request, res: Response, next: NextFunction) {
    const apiKey: string = req.get('X-API-KEY');
    const headerToken: string = req.get('Authorization');

    if (apiKey) {
      const verifiedApiKey: boolean =
        await ServiceAuthUtils.validateApiKey(apiKey);

      if (!verifiedApiKey) {
        throw new UnauthorizedException('api key tidak valid!');
      }
    } else if (headerToken) {
      if (!headerToken.toLowerCase().startsWith('bearer ')) {
        throw new BadRequestException('format token tidak valid!');
      }

      const token = headerToken.split(' ')[1];
      const verifiedToken: TokenPayload = ServiceAuthUtils.validateToken(token);

      if (!verifiedToken) {
        throw new UnauthorizedException('token tidak valid!');
      }
    } else {
      throw new BadRequestException('api key atau token harus dikirimkan!');
    }

    next();
  }
}
