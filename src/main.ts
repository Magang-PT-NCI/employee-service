import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app.config';
import { logger } from './utils/logger.utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  logger.info(`Application started on port ${PORT}`);

  const config = new DocumentBuilder()
    .setTitle('Employee Service API')
    .setDescription('API documentation for Employee Service')
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'apiKey')
    .addTag('Employee')
    .addTag('Auth')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
