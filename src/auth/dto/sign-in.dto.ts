import { IsString, MinLength } from 'class-validator';
import { Constants } from '../../shared/constants';

export class SignInDto {
  @IsString()
  emailOrNickname!: string;

  @IsString()
  password!: string;
}
