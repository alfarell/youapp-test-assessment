import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class HttpCatchFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    if (process.env.NODE_ENV === 'development')
      console.log('http-exception: ', exception);
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx: HttpArgumentsHost = host.switchToHttp();

    const exceptionStatus = parseInt(
      exception?.status || exception?.response?.statusCode,
    );
    const statusCode = exceptionStatus || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception?.response?.message || exception?.message;
    const error = isNaN(exceptionStatus)
      ? 'ServerError'
      : exception?.response?.error;
    const responseBody = {
      statusCode,
      message,
      error,
      name: exception?.name,
      options: exception?.options,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
