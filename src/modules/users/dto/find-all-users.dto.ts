import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class FindAllUsersDto {
  @Min(1)
  @Max(50)
  @IsInt()
  @IsOptional()
  take?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  skip?: number;

  @IsUUID(4, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categoryIds?: string[];
}
