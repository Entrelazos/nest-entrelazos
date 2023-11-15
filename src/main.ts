import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const allowedOrigins = [
    'http://localhost:5173',
    'https://pear-clear-sockeye.cyclic.app',
  ];
  app.enableCors({
    origin: allowedOrigins, // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}
bootstrap();
