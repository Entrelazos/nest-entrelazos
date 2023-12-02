import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { City } from 'src/common/entities/city.entity';
import { Permission } from './entities/permission.entity';
import { UtilsModule } from 'src/util/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, City]),
    UtilsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
