// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IEvent {}

export interface IAggregateRoot<EventBase extends IEvent = IEvent> {
  commit(): void;
  getUncommittedEvents(): EventBase[];
  apply<T extends EventBase = EventBase>(event: T, isFromHistory?: boolean): void;
}
