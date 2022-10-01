import { IsOptional, IsString } from 'class-validator';
import { PagingDto } from '../../../shared/util/paging.dto';

export class FindAllCategoriesDto extends PagingDto {
  @IsString()
  @IsOptional()
  name?: string;
}
