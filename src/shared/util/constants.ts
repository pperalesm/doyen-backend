export const Constants = {
  OPENED_AT_DAYS: 3,
  PHASED_AT_DAYS: 2,
  CLOSED_AT_DAYS: 1,
  CATEGORIES_MAX_SIZE: 5,
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
  CATEGORY_NAME_MAX_LENGTH: 45,
  DURATION_MIN: 5,
  DURATION_MAX: 60 * 24,
  PARTICIPANTS_MIN: 1,
  PARTICIPANTS_MAX: 499,
  BASE_PRICE_MIN: 0,
  NEXT_IN_MIN: 1,
  PARTICIPANTS_INVALID_MESSAGE:
    'The number of participants plus the number of collaborations must be lower than 499',
  SCHEDULED_AT_INVALID_MESSAGE: 'scheduledAt must be a future date',
  SCHEDULED_AT_AUCTION_INVALID_MESSAGE:
    'scheduledAt must be at least 3 days into the future',
  COLLABORATION_INVALID_MESSAGE:
    'You cannot be present within the collaborations',
  COLLABORATION_PERCENTAGE_INVALID_MESSAGE:
    'The sum of all percentages must not be greater than 100',
};
