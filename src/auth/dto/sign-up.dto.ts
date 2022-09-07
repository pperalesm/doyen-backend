import {
  IsBoolean,
  IsDate,
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

  @Matches(Constants.USERNAME_REGEXP, {
    message: Constants.USERNAME_INVALID_MESSAGE,
  })
  @MinLength(Constants.USERNAME_MIN_LENGTH)
  @MaxLength(Constants.USERNAME_MAX_LENGTH)
  @IsString()
  username!: string;

  @IsDate()
  dateOfBirth!: Date;

  @IsIn(Constants.VALID_GENDERS)
  @IsString()
  gender!: string;

  @MinLength(Constants.PASSWORD_MIN_LENGTH)
  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  about?: string;

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
}
