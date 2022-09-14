import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Constants } from '../../../shared/util/constants';

export class UpdateInfoDto {
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

  @ArrayMaxSize(Constants.CATEGORYIDS_MAX_SIZE)
  @IsUUID(4, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
