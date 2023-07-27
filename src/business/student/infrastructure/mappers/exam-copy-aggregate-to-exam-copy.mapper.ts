import { DeepPartial } from 'typeorm';

import { ExamCopyAggregate } from '../../domain/aggregates/exam-copy.aggregate';
import { ExamCopyQuestionEntity } from '../../domain/entities/exam-copy-question.entity';
import { ExamCopyQuestion } from '../database/entities/exam-copy-question.entity';
import { ExamCopy } from '../database/entities/exam-copy.entity';

export function examCopyAggregateToExamCopy(examCopy: ExamCopyAggregate): DeepPartial<ExamCopy> {
  return {
    id: examCopy.id,
    examId: examCopy.examId,
    state: examCopy.state,
    questions: examCopy.questions.map(examCopyQuestionEntityToExamCopyQuestion),
    currentQuestionIndex: examCopy.currentQuestionIndex,
    createdAt: examCopy.createdAt,
    updatedAt: examCopy.updatedAt,
  };
}

function examCopyQuestionEntityToExamCopyQuestion(question: ExamCopyQuestionEntity): DeepPartial<ExamCopyQuestion> {
  return {
    id: question.id,
    type: question.type,
    examCopy: { id: question.examCopyId },
    examQuestionId: question.examQuestionId,
    order: question.order,
    question: question.question,
    propositions: question.propositions,
    answer: question.answer.value,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
    response: question.response
      ? {
          id: question.response.id,
          response: question.response.response.value,
          valid: question.response.valid,
          createdAt: question.response.createdAt,
        }
      : null,
  };
}
