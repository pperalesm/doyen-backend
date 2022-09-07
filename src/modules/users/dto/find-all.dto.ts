import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FindAllDto {
  @Min(1)
  @Max(50)
  @IsInt()
  @IsOptional()
  take?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  skip?: number;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  categories?: string[];
}
