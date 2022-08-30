import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Constants } from '../../shared/constants';

export class SignUpDto {
  @Matches(Constants.EMAIL_REGEXP, { message: Constants.EMAIL_INVALID_MESSAGE })
  @MaxLength(Constants.EMAIL_MAX_LENGTH)
  @IsString()
  email!: string;

  @MinLength(Constants.NICKNAME_MIN_LENGTH)
  @MaxLength(Constants.NICKNAME_MAX_LENGTH)
  @IsString()
  nickname!: string;

  @MinLength(Constants.PASSWORD_MIN_LENGTH)
  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  acceptsEmails?: boolean;

  @IsIn(Constants.VALID_LANGUAGES)
  @IsString()
  @IsOptional()
  language?: string;

  @IsIn(Constants.VALID_CURRENCIES, {
    message: Constants.CURRENCY_INVALID_MESSAGE,
  })
  @IsString()
  @IsOptional()
  currency?: string;
}
