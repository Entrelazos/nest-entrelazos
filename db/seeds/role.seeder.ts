import { Role } from 'src/user/entities/role.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(Role);
    const data = {
      role_name: 'Administrador',
      is_active: true,
    };

    const role = await repository.findOneBy({ role_name: data.role_name });
    if (!role) {
      await repository.insert([data]);
    }
  }
}
