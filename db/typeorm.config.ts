import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import createDataSourceOptions from './data-source';
import InitSeeder from './seeds/init.seeder';

export const createTypeOrmConfig = async (
  configService: ConfigService,
): Promise<DataSource> => {
  const dataSourceOptions = await createDataSourceOptions(configService);

  return new DataSource({
    ...dataSourceOptions,
    seeds: [InitSeeder],
  } as DataSourceOptions & SeederOptions);
};
