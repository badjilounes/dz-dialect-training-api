import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Type } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

import { DomainError } from './domain-error';

type ExceptionFactory<T extends DomainError = DomainError> = (error: T) => Error;
type InstanceType<T extends Type<unknown>> = T extends Type<infer U> ? U : never;

@Injectable()
export abstract class DomainErrorInterceptor implements NestInterceptor {
  private map: Map<Type<DomainError>, ExceptionFactory> = new Map();

  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof DomainError) {
          this.handleError(error);
        }
        throw error;
      }),
    );
  }

  protected register<T extends Type<DomainError>>(
    errorType: T | T[],
    exceptionFactory: ExceptionFactory<InstanceType<T>>,
  ) {
    const types = Array.isArray(errorType) ? errorType : [errorType];
    types.forEach((type) => this.map.set(type, exceptionFactory as ExceptionFactory));
  }

  private handleError(error: DomainError) {
    const factory = this.map.get(error.constructor as Type<DomainError>);
    if (factory) {
      const appError = factory(error);
      appError.stack = error.stack;
      throw appError;
    }
  }
}
