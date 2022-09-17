import { User } from '../../../database/entities/user.entity';

export class AuthUserDto {
  id: string;
  email: string;
  username: string;
  isActive: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.username = user.username;
    this.isActive = user.isActive;
  }
}
