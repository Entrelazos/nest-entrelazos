import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { City } from 'src/common/entities/city.entity';
import { UtilsModule } from 'src/util/utils.module';
import { UserCompanyService } from './services/user-company.service';
import { UserCompany } from './entities/user-company.entity';
import { Company } from 'src/company/entities/company.entity';
import { CompanyService } from 'src/company/company.service';
import { CompanyAddress } from 'src/company/entities/company-address.entity';
import { Social } from 'src/common/entities/social.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      City,
      UserCompany,
      Company,
      CompanyAddress,
      Social,
      Category,
    ]),
    UtilsModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserCompanyService, CompanyService],
})
export class UserModule {}
