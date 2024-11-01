import { Catch, HttpException, ExceptionFilter } from '@nestjs/common';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class RpcValidationPipeFilter implements ExceptionFilter {
  // in case the second argument is needed
  // the format will be "host: ArgumentsHost"
  catch(exception: HttpException) {
    return throwError(() => exception);
  }
}
