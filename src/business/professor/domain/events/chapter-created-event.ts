import { ChapterAggregate } from '../aggregates/chapter.aggregate';

export class ChapterCreatedEvent {
  constructor(public chapter: ChapterAggregate) {}
}
