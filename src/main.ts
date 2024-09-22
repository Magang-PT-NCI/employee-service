import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set content type for all response
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

  await app.listen(3000);
}
bootstrap();
