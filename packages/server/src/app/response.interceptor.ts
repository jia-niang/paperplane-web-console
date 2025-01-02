import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

/** 响应包装 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ISuccessBody<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ISuccessBody<T>> {
    return next.handle().pipe(
      map(data => {
        return {
          success: true,
          code: context.switchToHttp().getResponse().statusCode,
          message: data?.message,
          data,
        }
      })
    )
  }
}
