export class OtherUserDto {
  id: string;
  username: string;
  isVerified: boolean;
  name?: string;
  avatarUrl?: string;
  about?: string;
  profession?: string;

  constructor({
    id,
    username,
    isVerified,
    name,
    avatarUrl,
    about,
    profession,
  }: {
    id: string;
    username: string;
    isVerified: boolean;
    name?: string;
    avatarUrl?: string;
    about?: string;
    profession?: string;
  }) {
    this.id = id;
    this.username = username;
    this.isVerified = isVerified;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.about = about;
    this.profession = profession;
  }
}
