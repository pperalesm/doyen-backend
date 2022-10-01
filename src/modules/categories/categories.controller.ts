import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query() findAllCategoriesDto: FindAllCategoriesDto) {
    return await this.categoriesService.findAll(findAllCategoriesDto);
  }
}
