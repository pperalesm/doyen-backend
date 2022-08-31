import { IsString, MinLength } from 'class-validator';
import { Constants } from '../../shared/constants';

export class SignInDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
