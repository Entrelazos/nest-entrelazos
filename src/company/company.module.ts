import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsModule } from 'src/util/utils.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company } from './entities/company.entity';
import { CompanyAddress } from './entities/company-address.entity';
import { UserCompany } from 'src/user/entities/user-company.entity';
import { Social } from 'src/common/entities/social.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company, CompanyAddress, UserCompany, Social]),
    UtilsModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
