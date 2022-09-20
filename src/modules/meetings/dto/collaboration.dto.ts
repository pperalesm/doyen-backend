import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CollaborationDto {
  @IsUUID(4)
  @IsString()
  userId!: string;

  @Min(0)
  @Max(100)
  @IsInt()
  percentage!: number;
}
