import { ExamEntity } from '../../entities/exam.entity';

export class ExamCreatedEvent {
  constructor(public exam: ExamEntity) {}
}
