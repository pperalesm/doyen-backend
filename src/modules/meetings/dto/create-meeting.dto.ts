import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Constants } from '../../../shared/util/constants';
import { CreateCollaborationDto } from '../../collaborations/dto/create-collaboration.dto';

export class CreateMeetingDto {
  @IsString()
  title!: string;

  @IsBoolean()
  isAuction!: boolean;

  @Min(Constants.BASE_PRICE_MIN)
  @IsNumber()
  basePrice!: number;

  @Min(Constants.PARTICIPANTS_MIN)
  @Max(Constants.PARTICIPANTS_MAX)
  @IsInt()
  maxParticipants!: number;

  @Min(Constants.DURATION_MIN)
  @Max(Constants.DURATION_MAX)
  @IsInt()
  duration!: number;

  @Min(Constants.NEXT_IN_MIN)
  @IsInt()
  @IsOptional()
  nextIn?: number;

  @IsDate()
  scheduledAt!: Date;

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

  @ValidateNested({ each: true })
  @Type(() => CreateCollaborationDto)
  @IsArray()
  @IsOptional()
  collaborationsInfo?: CreateCollaborationDto[];
}
