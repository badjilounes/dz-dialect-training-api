import { ExamTypeEnum } from '../../enums/exam-type.enum';

import { Query } from '@cqrs/query';

type GetPresentationExamQuestion = {
  id: string;
  question: string;
  answer: string;
  propositions: string[];
};

type GetPresentationExam = {
  id: string;
  name: string;
  type: ExamTypeEnum;
  questions: GetPresentationExamQuestion[];
};

export type GetPresentationQueryResult = {
  id: string;
  category: string;
  exam: GetPresentationExam;
};

export class GetPresentationQuery extends Query<GetPresentationQueryResult> {}
