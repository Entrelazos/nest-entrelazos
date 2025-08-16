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
    migrations: ['dist/db/migrations/*{.js,.ts}'],
    synchronize: true,
    migrationsTableName: 'migrations_history',
  };
};

export default createDataSourceOptions;
