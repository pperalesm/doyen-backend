import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Constants } from '../../../shared/util/constants';

export class UpdateMeetingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @MaxLength(Constants.CATEGORY_NAME_MAX_LENGTH, { each: true })
  @IsString({ each: true })
  @ArrayMaxSize(Constants.CATEGORIES_MAX_SIZE)
  @IsArray()
  @IsOptional()
  categoryNames?: string[];
}
