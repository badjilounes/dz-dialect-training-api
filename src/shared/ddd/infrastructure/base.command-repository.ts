import { IAggregateCollection } from '../domain/aggregate-collection/aggregate-collection.interface';

import { IBaseCommandRepository } from './base.command-repository.interface';

import { AggregateRoot } from '@cqrs/aggregate';

type AnyPromise = Promise<any>;

type EventClass = new (...args: any) => any;

export type DatabaseOperation<T extends EventClass, U extends AnyPromise> = (event: InstanceType<T>) => U | U[];

export abstract class BaseCommandRepository<T extends AggregateRoot, U extends AnyPromise>
  implements IBaseCommandRepository<T, U>
{
  private databaseOperations = new Map<string, DatabaseOperation<EventClass, U>>();

  protected register<E extends EventClass>(eventClass: E, databaseOperation: DatabaseOperation<E, U>): void {
    if (this.databaseOperations.has(eventClass.name)) {
      throw new Error(`${eventClass.name} already bound`);
    }

    this.databaseOperations.set(eventClass.name, databaseOperation);
  }

  abstract transaction(promises: U[]): void | Promise<void>;

  async persist(aggregateRoot: T | IAggregateCollection<T>): Promise<void> {
    const events = aggregateRoot.getUncommittedEvents();
    await this.transaction(this.executeDatabaseOperations(events));
    aggregateRoot.commit();
  }

  private executeDatabaseOperations(events: InstanceType<any>): U[] {
    return events
      .filter((event: EventClass) => this.databaseOperations.has(event.constructor.name))
      .map((event: EventClass) => this.databaseOperations.get(event.constructor.name)?.call(this, event))
      .flat();
  }
}
