import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  { success: boolean; message: string; data: T }
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<{
    success: boolean;
    message: string;
    data: T;
  }> {
    return next.handle().pipe(
      map((data: T) => ({
        success: true,
        message: 'Request successful',
        data,
      })),
    );
  }
}
