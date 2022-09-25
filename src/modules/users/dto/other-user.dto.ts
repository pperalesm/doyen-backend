import { Category } from '../../../database/entities/category.entity';
import { User } from '../../../database/entities/user.entity';

export class OtherUserDto {
  id: string;
  username: string;
  isVerified: boolean;
  name?: string;
  avatarUrl?: string;
  about?: string;
  profession?: string;
  categories?: Category[];

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.isVerified = user.isVerified;
    this.name = user.name;
    this.avatarUrl = user.avatarUrl;
    this.about = user.about;
    this.profession = user.profession;
    this.categories = user.categories ? user.categories : [];
  }
}
