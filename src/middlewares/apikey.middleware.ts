import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';

@Injectable()
export class ApikeyMiddleware implements NestMiddleware {
  constructor(private readonly service: EmployeeService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.get('X-API-KEY');

    if (!apiKey) {
      throw new BadRequestException('api key harus dikirimkan!');
    }

    const verifiedApiKey = await this.service.verifyApiKey(apiKey);
    if (!verifiedApiKey) {
      throw new BadRequestException('api key tidak valid!');
    }

    next();
  }
}
