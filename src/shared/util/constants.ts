export const Constants = {
  CATEGORYIDS_MAX_SIZE: 5,
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
  DURATION_MIN: 5,
  DURATION_MAX: 60 * 24,
  PARTICIPANTS_MIN: 1,
  PARTICIPANTS_MAX: 499,
  BASE_PRICE_MIN: 0,
  NEXT_IN_MIN: 1,
  PARTICIPANTS_INVALID_MESSAGE:
    'The number of participants plus the number of collaborations must be lower than 499',
  SCHEDULED_AT_INVALID_MESSAGE: 'scheduledAt must be a future date',
  COLLABORATION_INVALID_MESSAGE:
    'You cannot be present within the collaborations',
};
