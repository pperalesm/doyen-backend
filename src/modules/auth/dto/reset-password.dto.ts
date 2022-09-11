import { IsString, MinLength } from 'class-validator';
import { Constants } from '../../../shared/constants';

export class ResetPasswordDto {
  @IsString()
  token!: string;

  @MinLength(Constants.PASSWORD_MIN_LENGTH)
  @IsString()
  password!: string;
}
