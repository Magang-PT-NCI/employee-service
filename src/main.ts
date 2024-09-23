import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from './config/app.config';
import { logger } from './utils/logger.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  logger.info(`Application started on port ${port}`);

  await app.listen(port);
}
bootstrap();
