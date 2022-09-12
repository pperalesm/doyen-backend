import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoriesRepository.createQueryBuilder().getMany();
  }

  async findAllById(ids: string[]) {
    return await this.categoriesRepository
      .createQueryBuilder()
      .where('Category.id IN (:...ids)', { ids: ids })
      .getMany();
  }
}
