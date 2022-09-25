import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateCollaborationDto {
  @IsUUID(4)
  @IsString()
  userId!: string;

  @Min(0)
  @Max(100)
  @IsInt()
  percentage!: number;
}
