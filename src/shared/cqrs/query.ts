import {
  Constructor,
  IQuery,
  IQueryHandler as NestIQueryHandler,
  QueryHandler as NestQueryHandler,
} from '@nestjs/cqrs';

export class Query<R> implements IQuery {
  /**
   * This field is mandatory to be able to extract {@link R} from the query.
   * It won't never have a value and it is only used for type inference.
   */
  protected resultType?: R;
}

/**
 * Extract the result type generic of a query.
 */
export type ResultTypeOfQuery<Q> = Q extends Query<infer R> ? R : never;

/**
 * Type replacement for {@link NestIQueryHandler IQueryHandler} which allows to infer the result type of the query.
 */
export type IQueryHandler<Q extends Query<unknown>> = NestIQueryHandler<Q, ResultTypeOfQuery<Q>>;

/**
 * @see {@link NestQueryHandler QueryHandler}
 */
export const QueryHandler: (query: Constructor<Query<unknown>>) => ClassDecorator = NestQueryHandler;
