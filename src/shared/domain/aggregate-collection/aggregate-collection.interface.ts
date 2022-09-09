import { IAggregateRoot } from '../aggregate-root/aggregate-root.interface';

export type IAggregateCollection<T extends IAggregateRoot> = IAggregateRoot<T>;
