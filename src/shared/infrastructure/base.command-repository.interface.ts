import { IAggregateCollection } from '../domain/aggregate-collection/aggregate-collection.interface';
import { IAggregateRoot } from '../domain/aggregate-root/aggregate-root.interface';

export interface IBaseCommandRepository<T extends IAggregateRoot, U extends Promise<any> = Promise<any>> {
  persist(aggregateRoot: T | IAggregateCollection<T>): Promise<void>;
  transaction(promises: U[]): void | Promise<void>;
}
