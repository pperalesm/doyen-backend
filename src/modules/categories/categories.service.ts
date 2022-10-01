import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Category } from '../../database/entities/category.entity';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(findAllCategoriesDto: FindAllCategoriesDto) {
    let query = this.categoriesRepository.createQueryBuilder();
    if (findAllCategoriesDto.name) {
      query = query.andWhere('Category.name LIKE :name', {
        name: '%' + findAllCategoriesDto.name + '%',
      });
    }
    return await query
      .orderBy({ name: 'ASC' })
      .take(findAllCategoriesDto?.take || 10)
      .skip(findAllCategoriesDto?.skip)
      .getMany();
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
