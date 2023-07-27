import { ExamCopyQuestionEntityProps } from '../../domain/entities/exam-copy-question.entity';
import { ExamCopyQuestion } from '../database/entities/exam-copy-question.entity';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';

export function examCopyToExamCopyAggregate(examCopy: ExamCopy): ExamCopyAggregate {
  return ExamCopyAggregate.from({
    id: examCopy.id,
    examId: examCopy.examId,
    state: examCopy.state,
    questions: examCopy.questions.map((question) =>
      examCopyQuestionToExamCopyQuestionEntityProps(examCopy.id, question),
    ),
    currentQuestionIndex: examCopy.currentQuestionIndex,
    createdAt: examCopy.createdAt,
    updatedAt: examCopy.updatedAt,
  });
}

function examCopyQuestionToExamCopyQuestionEntityProps(
  examCopyId: string,
  question: ExamCopyQuestion,
): ExamCopyQuestionEntityProps {
  const answer = AnswerValueType.from({ questionType: question.type, value: question.answer });
  return {
    id: question.id,
    type: question.type,
    examCopyId,
    examQuestionId: question.examQuestionId,
    order: question.order,
    question: question.question,
    propositions: question.propositions,
    answer,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    response: question.response
      ? {
          id: question.response.id,
          questionId: question.id,
          answer,
          response: AnswerValueType.from({ questionType: question.type, value: question.response.response }),
          createdAt: question.response.createdAt,
        }
      : undefined,
  };
}
