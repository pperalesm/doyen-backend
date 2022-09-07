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

  constructor({
    id,
    email,
    username,
    dateOfBirth,
    gender,
    isPublic,
    isActive,
    isVerified,
    acceptsEmails,
    language,
    name,
    avatarUrl,
    about,
    profession,
  }: {
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
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.isPublic = isPublic;
    this.isActive = isActive;
    this.isVerified = isVerified;
    this.acceptsEmails = acceptsEmails;
    this.language = language;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.about = about;
    this.profession = profession;
  }
}
