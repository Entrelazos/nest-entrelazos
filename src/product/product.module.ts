import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { UtilsModule } from 'src/util/utils.module';
import { Company } from 'src/company/entities/company.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Company, Category]),
    UtilsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
