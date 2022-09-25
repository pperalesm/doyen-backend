import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomForbidden extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.FORBIDDEN, message, 'Forbidden');
  }
}
