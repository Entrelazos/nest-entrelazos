import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import createDataSourceOptions from './data-source';
import { DataSource } from 'typeorm';

export const createTypeOrmConfig = async (
  configService: ConfigService,
): Promise<DataSource> => {
  const dataSourceOptions = await createDataSourceOptions(configService);

  return new DataSource({
    ...dataSourceOptions,
  });
};
