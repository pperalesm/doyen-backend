import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomInternalServerError extends CustomHttpException {
  constructor() {
    super(
      HttpStatus.INTERNAL_SERVER_ERROR,
      ['An unknown error occurred. Please try again later.'],
      'Internal Server Error',
    );
  }
}
