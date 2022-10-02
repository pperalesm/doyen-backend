import { IsUUID } from 'class-validator';

export class CreatePurchaseDto {
  @IsUUID(4)
  meetingId!: string;
}
