import { ExamEntity } from '../entities/exam.entity';

export class TrainingExamCreatedEvent {
  constructor(public exam: ExamEntity) {}
}
