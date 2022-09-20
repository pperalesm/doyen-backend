import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomBadRequest extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.BAD_REQUEST, message, 'Bad Request');
  }
}
