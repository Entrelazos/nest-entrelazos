import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  const allowedOrigins = ['*'];
  app.enableCors({
    origin: '*', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Entrelazos API')
    .setDescription('Proyecto "Misionero compra misionero"')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('port'));
}
bootstrap();
