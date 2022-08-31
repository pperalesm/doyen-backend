export class MyUserDto {
  id: string;
  email: string;
  username: string;
  isPublic: boolean;
  isVerified: boolean;
  acceptsEmails: boolean;
  language: string;
  name?: string;
  imageUrl?: string;
  description?: string;
  profession?: string;

  constructor({
    id,
    email,
    username,
    isPublic,
    isVerified,
    acceptsEmails,
    language,
    name,
    imageUrl,
    description,
    profession,
  }: {
    id: string;
    email: string;
    username: string;
    isPublic: boolean;
    isVerified: boolean;
    acceptsEmails: boolean;
    language: string;
    name?: string;
    imageUrl?: string;
    description?: string;
    profession?: string;
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.isPublic = isPublic;
    this.isVerified = isVerified;
    this.acceptsEmails = acceptsEmails;
    this.language = language;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.profession = profession;
  }
}
