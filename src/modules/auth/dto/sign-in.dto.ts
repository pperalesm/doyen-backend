import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  usernameOrEmail!: string;

  @IsString()
  password!: string;
}
