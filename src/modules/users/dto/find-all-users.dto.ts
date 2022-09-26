import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { PagingDto } from '../../../shared/util/paging.dto';

export class FindAllUsersDto extends PagingDto {
  @IsUUID(4, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
