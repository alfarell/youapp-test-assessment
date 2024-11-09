import {
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { throwError } from 'rxjs';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError) {
    const isHttpException = exception instanceof HttpException;
    return throwError(() =>
      isHttpException ? exception : new InternalServerErrorException(exception),
    );
  }
}
