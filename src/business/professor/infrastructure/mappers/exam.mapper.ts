import { ExamAggregate } from '../../domain/aggregates/exam.aggregate';
import { TrainingExam } from '../database/entities/training-exam.entity';

import { questionToQuestionEntity } from './question.mapper';

export function examToExamAggregate(exam: TrainingExam): ExamAggregate {
  return ExamAggregate.from({
    id: exam.id,
    name: exam.name,
    courseId: exam.course.id,
    questions: exam.questions.map(questionToQuestionEntity),
  });
}
