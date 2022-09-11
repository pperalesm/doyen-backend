import { HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';

export class CustomConflict extends CustomHttpException {
  constructor(message: string[]) {
    super(HttpStatus.CONFLICT, message, 'Conflict');
  }
}
