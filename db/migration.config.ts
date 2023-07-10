import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

import { createTypeOrmConfig } from './typeorm.config';

async function dbConfigTypeOrm() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false
  });
  const configService = app.get(ConfigService);
  const dataSource = await createTypeOrmConfig(configService);
  app.close();
  
  return dataSource;
}
export default dbConfigTypeOrm();