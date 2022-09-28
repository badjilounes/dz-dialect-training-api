import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

type GetPresentationExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

type GetPresentationExam = {
  id: string;
  name: string;
  questions: GetPresentationExamQuestion[];
};

export type GetPresentationQueryResult = {
  id: string;
  category: string;
  exam: GetPresentationExam;
};

export class GetPresentationQuery extends Query<GetPresentationQueryResult> {}
