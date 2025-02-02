import {
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class CustomRpcExceptionFilter extends BaseRpcExceptionFilter {
  // in case the second argument is needed
  // the format will be "host: ArgumentsHost"
  catch(exception: RpcException) {
    const isHttpException = exception instanceof HttpException;
    return throwError(() =>
      isHttpException ? exception : new InternalServerErrorException(exception),
    );
  }
}
