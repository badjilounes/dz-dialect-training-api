import { AggregateRoot, IEvent } from '@nestjs/cqrs';

export class AggregateCollection<T extends AggregateRoot> extends AggregateRoot {
  protected collection: T[] = [];

  getUncommittedEvents(): IEvent[] {
    return [
      ...this.collection.flatMap((aggregate) => aggregate.getUncommittedEvents()),
      ...super.getUncommittedEvents(),
    ];
  }

  commit(): void {
    this.mergeContext();
    this.collection.forEach((aggregate) => aggregate.commit());
    super.commit();
  }

  private mergeContext(): void {
    this.collection.forEach((aggregate) => {
      aggregate.publish = this.publish;
      aggregate.publishAll = this.publishAll;
    });
  }
}
