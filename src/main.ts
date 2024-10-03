import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app.config';
import { logger } from './utils/logger.utils';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();

  logger.info(`Application started on port ${PORT}`);

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Employee Service API')
    .setDescription('API documentation for Employee Service')
    .setVersion('1.0.0')
    .addApiKey({ type: 'apiKey', name: 'X-API-KEY', in: 'header' }, 'apiKey')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addTag('Employee')
    .addTag('Auth')

    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
