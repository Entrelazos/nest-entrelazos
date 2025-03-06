import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { UtilsModule } from 'src/util/utils.module';
import { Company } from 'src/company/entities/company.entity';
import { Category } from 'src/category/entities/category.entity';
import { ImageService } from 'src/image/image.service';
import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { NotificationService } from 'src/notification/NotificationService';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Company, Category, Image, User]),
    UtilsModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, ImageService, NotificationService],
})
export class ProductModule {}
