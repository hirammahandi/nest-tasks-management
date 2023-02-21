import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as transform from 'class-transformer';
import { ConfigService } from '@nestjs/config';

// *@note if it use try/catch nest no will throw any more InternalServerErrorException

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();

  // *@note Set the main route using the global prefix
  app.setGlobalPrefix('api');

  if (config.get<string>('NODE_ENV') === 'development') {
    app.enableCors();
  }

  // *@note Set useGlobalPipes to validate all controllers
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformerPackage: transform,
    }),
  );

  const PORT = process.env.PORT || config.get('API_PORT');
  const HOST = config.get('API_HOST');

  await app.listen(PORT);

  Logger.log(`🚀 Application is running on: ${HOST}:${PORT}/api`);
}
bootstrap();
