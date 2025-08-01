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
  Patch,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { ApprovalStatus, Product } from './entities/product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from 'src/category/entities/category.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductsDto, ProductDto } from './dto/product.dto';
import { JwtAuthGuard } from 'src/guards/jwt/jwt-auth.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Role } from 'src/types/role.types';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'product_name',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
    @Query('search') search = '',
    @Query('categoryIds') categoryIds: number[] = [],
    @Query('companyId') companyId,
  ): Promise<Pagination<Product>> {
    try {
      const options = {
        page,
        limit,
        orderBy,
        orderDirection,
        search,
        categoryIds,
        companyId: companyId ? parseInt(companyId, 10) : undefined,
      };
      return await this.productService.findAll(options);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AnyFilesInterceptor())
  @Post('bulk')
  async createMany(
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() createProductsDto: CreateProductsDto,
  ): Promise<Product[]> {
    const { products } = createProductsDto;

    const productsWithFiles = products.map((product, index) => ({
      ...product,
      files:
        files?.filter?.(
          (file) => file.fieldname === `products[${index}][files][]`,
        ) || [],
    }));

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
      price: parseFloat(body.price), // Convert string to number
      company_id: parseInt(body.company_id, 10), // Convert string to integer
      category_ids: body.category_ids?.map((id: string) => parseInt(id, 10)), // Convert array of strings to numbers
      existingImages:
        body.existingImages?.map((id: string) => parseInt(id, 10)) || [],
    };

    return this.productService.updateOne(id, { ...updateProductDto, files });
  }

  @Get('/products-status')
  // @Roles(Role.Admin)
  @UseGuards(AuthGuard('jwt'))
  async getProductsByStatus(
    @Query('status') status: ApprovalStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Pagination<Product>> {
    try {
      return this.productService.getProductsByStatus(
        status,
        page,
        limit,
        orderBy,
        orderDirection,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('/update-status')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.Admin)
  async updateProductStatuses(
    @Body() body: { productIds: number[]; status: ApprovalStatus },
  ) {
    return this.productService.updateMultipleProductStatuses(
      body.productIds,
      body.status,
    );
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
