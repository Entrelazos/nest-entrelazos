import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createDataSourceOptions = async (
  configService: ConfigService,
): Promise<DataSourceOptions> => {
  return {
    type: 'mysql',
    host: configService.get<string>('dbHost', 'localhost'),
    port: configService.get<number>('dbPort', 3306),
    database: configService.get<string>('dbDatabase', 'entrelazos'),
    username: configService.get<string>('dbUser', 'root'),
    password: configService.get<string>('dbPass', ''),
    entities: ['dist/**/*.entity{.js,.ts}'],
    migrationsTableName: 'migrations',
    migrations: ['dist/db/migrations/*{.js,.ts}'],
  };
};

export default createDataSourceOptions;
