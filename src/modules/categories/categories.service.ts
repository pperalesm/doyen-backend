import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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

  async findOrCreate(names: string[], entityManager: EntityManager) {
    const categories = await this.categoriesRepository
      .createQueryBuilder()
      .where('Category.name IN (:...names)', { names: names })
      .getMany();
    if (categories.length < names.length) {
      let createdCategories: Category[] = [];
      for (const name of names) {
        if (!categories.filter((category) => category.name === name).length) {
          createdCategories.push(
            this.categoriesRepository.create({ name: name }),
          );
        }
      }
      createdCategories = await entityManager
        .getRepository(Category)
        .save(createdCategories);
      categories.push(...createdCategories);
    }
    return categories;
  }
}
