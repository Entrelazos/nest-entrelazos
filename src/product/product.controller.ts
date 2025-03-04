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
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from 'src/category/entities/category.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductsDto, ProductDto } from './dto/product.dto';

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

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  @UseInterceptors(AnyFilesInterceptor()) // Allows file uploads
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any, // Use `any` because we need to manually parse `FormData`
  ) {
    // Manually parse boolean and number fields
    const updateProductDto: ProductDto = {
      ...body,
      is_service: body.is_service === 'true', // Convert string to boolean
      is_public: body.is_public === 'true',
      is_approved: body.is_approved === 'true',
      price: parseFloat(body.price), // Convert string to number
      company_id: parseInt(body.company_id, 10), // Convert string to integer
      category_ids: body.category_ids?.map((id: string) => parseInt(id, 10)), // Convert array of strings to numbers
    };

    return this.productService.updateOne(id, { ...updateProductDto, files });
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

  @Get(':id')
  async getSingleProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    try {
      return await this.productService.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
