import { UpdateExamEntityProps } from '../../entities/exam.entity';

export class ExamUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateExamEntityProps) {}
}
