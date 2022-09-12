import { Category } from '../../../database/entities/category.entity';
import { User } from '../../../database/entities/user.entity';

export class MyUserDto {
  id: string;
  email: string;
  username: string;
  dateOfBirth: Date;
  gender: string;
  isPublic: boolean;
  isActive: boolean;
  isVerified: boolean;
  acceptsEmails: boolean;
  language: string;
  name?: string;
  avatarUrl?: string;
  about?: string;
  profession?: string;
  categories?: Category[];

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.dateOfBirth = user.dateOfBirth;
    this.gender = user.gender;
    this.isPublic = user.isPublic;
    this.isActive = user.isActive;
    this.isVerified = user.isVerified;
    this.acceptsEmails = user.acceptsEmails;
    this.language = user.language;
    this.name = user.name;
    this.avatarUrl = user.avatarUrl;
    this.about = user.about;
    this.profession = user.profession;
    this.categories = user.categories;
  }
}
