import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';

export function examCopyToExamCopyAggregate(entity: ExamCopy): ExamCopyAggregate {
  return ExamCopyAggregate.from({
    id: entity.id,
    examId: entity.exam.id,
    state: entity.state,
    responses: entity.responses.map((response) => ({
      id: response.id,
      question: ExamQuestionEntity.from({
        id: response.question.id,
        examId: entity.exam.id,
        type: response.question.type,
        question: response.question.question,
        answer: AnswerValueType.from({ questionType: response.question.type, value: response.question.answer }),
        propositions: response.question.propositions,
      }),
      response: AnswerValueType.from({ questionType: response.question.type, value: response.response }),
    })),
  });
}
