import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomUnauthorized extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.UNAUTHORIZED, message, 'Unauthorized');
  }
}
