import { ExamCopyAggregate } from 'business/training/domain/aggregates/exam-copy.aggregate';
import { ExamQuestionEntity } from 'business/training/domain/entities/question.entity';
import { ExamCopy } from 'business/training/infrastructure/database/entities/exam-copy.entity';

export function examCopyToExamCopyAggregate(entity: ExamCopy): ExamCopyAggregate {
  return ExamCopyAggregate.from({
    id: entity.id,
    examId: entity.exam.id,
    responses: entity.responses.map((response) => ({
      id: response.id,
      question: ExamQuestionEntity.from({
        id: response.question.id,
        examId: entity.exam.id,
        type: response.question.type,
        question: response.question.question,
        answer: response.question.answer,
        propositions: response.question.propositions,
      }),
      response: response.response,
    })),
  });
}
