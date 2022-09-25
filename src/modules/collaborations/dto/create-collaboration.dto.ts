import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateCollaborationDto {
  @IsString()
  email!: string;

  @Min(0)
  @Max(100)
  @IsInt()
  percentage!: number;
}
