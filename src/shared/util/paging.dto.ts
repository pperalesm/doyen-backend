import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PagingDto {
  @Min(1)
  @Max(50)
  @IsInt()
  @IsOptional()
  take?: number;

  @Min(0)
  @IsInt()
  @IsOptional()
  skip?: number;
}
