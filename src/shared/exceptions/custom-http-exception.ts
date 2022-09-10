import { HttpException } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(statusCode: number, message: string[], error: string) {
    super(
      {
        statusCode: statusCode,
        message: message,
        error: error,
      },
      statusCode,
    );
  }
}
