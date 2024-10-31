import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  BadRequestException,
  Query,
  Body,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from 'src/category/entities/category.entity';
import { Company } from 'src/company/entities/company.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductsDto } from './dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Post('bulk')
  async createMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductsDto: CreateProductsDto,
  ): Promise<Product[]> {
    const { products } = createProductsDto;

    // Organize files based on their structure
    const productsWithFiles = products.map((product, index) => {
      return {
        ...product,
        files: files.filter(
          (file) => file.fieldname === `products[${index}][files][]`,
        ),
      };
    });

    return this.productService.createMany(productsWithFiles);
  }

  @Get('/byCompany/:id')
  async getProductsByCompany(
    @Param('id', ParseIntPipe) companyId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<Product>> {
    try {
      return await this.productService.getProductsByCompany(
        companyId,
        page,
        limit,
        orderBy,
        orderDirection,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('/byCategory/:id')
  async getProductsByCategory(
    @Param('id', ParseIntPipe) companyId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<Category>> {
    try {
      return await this.productService.getCategoryWithProducts(
        companyId,
        page,
        limit,
        orderBy,
        orderDirection,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
