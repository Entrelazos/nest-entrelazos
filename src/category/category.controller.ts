import {
  Controller,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(): Promise<Category[]> {
    try {
      return await this.categoryService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
