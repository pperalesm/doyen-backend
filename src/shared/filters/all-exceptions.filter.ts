import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomInternalServerError } from '../exceptions/custom-internal-server-error';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  logger = new Logger('Filter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : new CustomInternalServerError([
            'An unknown error occurred. Please try again later.',
          ]).getResponse();

    this.logger.error(exception.stack);

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
