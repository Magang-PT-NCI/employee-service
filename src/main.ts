import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app.config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { LoggerUtil } from './utils/logger.utils';

async function bootstrap(): Promise<void> {
  const logger = new LoggerUtil('Main');

  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors();
  logger.info('Loaded app modules');

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

  logger.info('Generated Swagger API Documentation');
  logger.info('Access /api to see the API documentation');
  logger.info('Access /api-json to see the Open API json file');
  logger.info('Access /api-yaml to see the Open API yaml file');

  await app.listen(PORT);
  logger.info(`Application started on port ${PORT}`);
}

bootstrap();
