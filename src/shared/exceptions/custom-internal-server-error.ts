import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomInternalServerError extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, 'Internal Server Error');
  }
}
