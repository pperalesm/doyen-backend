import { IsString, MinLength } from 'class-validator';
import { Constants } from '../../../shared/constants';

export class ChangePasswordDto {
  @IsString()
  oldPassword!: string;

  @MinLength(Constants.PASSWORD_MIN_LENGTH)
  @IsString()
  newPassword!: string;
}
