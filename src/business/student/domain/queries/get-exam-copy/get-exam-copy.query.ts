import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

type GetExamExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
  response?: {
    id: string;
    valid: boolean;
    answer: string;
    response: string;
    createdAt: Date;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GetExamCopyQueryResult = {
  id: string;
  examId: string;
  state: ExamCopyStateEnum;
  currentQuestionIndex: number;
  questions: GetExamExamQuestion[];
  createdAt: Date;
  updatedAt: Date;
};

export type GetExamQueryPayload = {
  examId: string;
};

export class GetExamCopyQuery extends Query<GetExamCopyQueryResult> {
  constructor(public readonly payload: GetExamQueryPayload) {
    super();
  }
}
