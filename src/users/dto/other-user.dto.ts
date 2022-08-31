export class OtherUserDto {
  id: string;
  username: string;
  isVerified: boolean;
  name?: string;
  imageUrl?: string;
  description?: string;
  profession?: string;

  constructor({
    id,
    username,
    isVerified,
    name,
    imageUrl,
    description,
    profession,
  }: {
    id: string;
    username: string;
    isVerified: boolean;
    name?: string;
    imageUrl?: string;
    description?: string;
    profession?: string;
  }) {
    this.id = id;
    this.username = username;
    this.isVerified = isVerified;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.profession = profession;
  }
}
