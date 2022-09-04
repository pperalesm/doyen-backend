export const Constants = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 4,
  USERNAME_MAX_LENGTH: 36,
  USERNAME_REGEXP: /^[a-zA-Z0-9_]+$/,
  USERNAME_INVALID_MESSAGE:
    '$property can only contain letters, numbers and underscores',
  LANGUAGE_MIN_LENGTH: 2,
  LANGUAGE_MAX_LENGTH: 2,
  EMAIL_MAX_LENGTH: 254,
  EMAIL_REGEXP: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  EMAIL_INVALID_MESSAGE: '$property must be a valid email address',
  VALID_LANGUAGES: ['en', 'es'],
  VALID_GENDERS: ['M', 'F', 'O'],
};
