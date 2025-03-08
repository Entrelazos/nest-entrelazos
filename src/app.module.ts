import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { configLoader } from '../config-loader';
import { envSchema } from '../env-schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import createDataSource from '../db/data-source';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './util/utils.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ImageModule } from './image/image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NotificationModule } from './notification/NotificationModule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configLoader],
      validationSchema: envSchema,
    }),
    ...(process.env.NODE_ENV === 'development'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), 'uploads'),
            serveRoot: '/uploads',
            serveStaticOptions: { index: false, fallthrough: false },
          }),
        ]
      : []),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return createDataSource(configService) as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    CompanyModule,
    UserModule,
    AuthModule,
    UtilsModule,
    ProductModule,
    CategoryModule,
    ImageModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
