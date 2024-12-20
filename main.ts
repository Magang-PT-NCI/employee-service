import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import {
  CERTIFICATE_FILE,
  KEY_FILE,
  PORT,
  SECURED,
} from 'src/config/app.config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { LoggerUtil } from 'src/utils/logger.utils';
import { readFileSync } from 'fs';

async function bootstrap(): Promise<void> {
  const logger = new LoggerUtil('Main');

  let httpsOptions = null;
  if (SECURED) {
    httpsOptions = {
      key: readFileSync(KEY_FILE),
      cert: readFileSync(CERTIFICATE_FILE),
    };
    logger.info('Server is running in secured mode (HTTPS)');
  } else {
    logger.info('Server is running in unsecured mode (HTTP)');
  }

  const app: INestApplication = await NestFactory.create(AppModule, {
    httpsOptions,
  });
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
