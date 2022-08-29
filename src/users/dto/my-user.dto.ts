export class MyUserDto {
  id: string;
  email: string;
  nickname: string;
  isPublic: boolean;
  isVerified: boolean;
  acceptsEmails: boolean;
  language: string;
  currency: string;
  timeZone: string;
  name?: string;
  imageUrl?: string;
  description?: string;
  profession?: string;

  constructor({
    id,
    email,
    nickname,
    isPublic,
    isVerified,
    acceptsEmails,
    language,
    currency,
    timeZone,
    name,
    imageUrl,
    description,
    profession,
  }: {
    id: string;
    email: string;
    nickname: string;
    isPublic: boolean;
    isVerified: boolean;
    acceptsEmails: boolean;
    language: string;
    currency: string;
    timeZone: string;
    name?: string;
    imageUrl?: string;
    description?: string;
    profession?: string;
  }) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
    this.isPublic = isPublic;
    this.isVerified = isVerified;
    this.acceptsEmails = acceptsEmails;
    this.language = language;
    this.currency = currency;
    this.timeZone = timeZone;
    this.name = name;
    this.imageUrl = imageUrl;
    this.description = description;
    this.profession = profession;
  }
}
