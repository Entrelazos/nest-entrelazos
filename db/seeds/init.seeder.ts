import { DataSource } from 'typeorm';
import { runSeeders, Seeder } from 'typeorm-extension';
import RoleSeeder from './role.seeder';

export default class InitSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [RoleSeeder],
    });
  }
}
