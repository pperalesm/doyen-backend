import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { PagingDto } from '../../../shared/util/paging.dto';

export class FindAllMeetingsDto extends PagingDto {
  @IsUUID(4, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];

  @IsUUID(4)
  @IsString()
  @IsOptional()
  userId?: string;

  @IsBoolean()
  @IsOptional()
  isAuction?: boolean;
}
