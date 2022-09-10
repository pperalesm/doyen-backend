import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomNotFound extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.NOT_FOUND, message, 'Not Found');
  }
}
