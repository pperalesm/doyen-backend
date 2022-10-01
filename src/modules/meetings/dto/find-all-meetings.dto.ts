import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
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

  @IsNumber()
  @IsOptional()
  minBasePrice?: number;

  @IsNumber()
  @IsOptional()
  maxBasePrice?: number;

  @IsInt()
  @IsOptional()
  minMaxParticipants?: number;

  @IsInt()
  @IsOptional()
  maxMaxParticipants?: number;

  @IsInt()
  @IsOptional()
  minDuration?: number;

  @IsInt()
  @IsOptional()
  maxDuration?: number;

  @IsDate()
  @IsOptional()
  minScheduledAt?: Date;

  @IsDate()
  @IsOptional()
  maxScheduledAt?: Date;
}
