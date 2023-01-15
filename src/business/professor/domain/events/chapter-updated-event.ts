import { UpdateTrainingChapterAggregateProps } from '../aggregates/chapter.aggregate';

export class ChapterUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateTrainingChapterAggregateProps) {}
}
