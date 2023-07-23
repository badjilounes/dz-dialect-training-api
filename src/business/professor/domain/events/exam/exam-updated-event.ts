import { UpdateExamAggregateProps } from '../../aggregates/exam.aggregate';

export class ExamUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateExamAggregateProps) {}
}
