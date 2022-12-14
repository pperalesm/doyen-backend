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

export class UpdateMeDto {
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;

  @IsIn(Constants.VALID_GENDERS)
  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  about?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  acceptsEmails?: boolean;

  @IsIn(Constants.VALID_LANGUAGES)
  @IsString()
  @IsOptional()
  language?: string;

  @MaxLength(Constants.CATEGORY_NAME_MAX_LENGTH, { each: true })
  @IsString({ each: true })
  @ArrayMaxSize(Constants.CATEGORIES_MAX_SIZE)
  @IsArray()
  @IsOptional()
  categoryNames?: string[];
}
