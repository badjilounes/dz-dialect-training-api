import { ExamQuestionEntity } from '../../domain/entities/question.entity';
import { AnswerValueType } from '../../domain/value-types/answer.value-type';
import { TrainingExamQuestion } from '../database/entities/training-exam-question.entity';

export function questionToQuestionEntity(question: TrainingExamQuestion): ExamQuestionEntity {
  return ExamQuestionEntity.from({
    id: question.id,
    examId: question.exam.id,
    question: question.question,
    type: question.type,
    answer: AnswerValueType.from({ questionType: question.type, value: question.answer }),
    propositions: question.propositions,
  });
}
