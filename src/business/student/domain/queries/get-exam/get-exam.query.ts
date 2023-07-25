import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { Query } from '@cqrs/query';

type GetExamExamQuestion = {
  id: string;
  type: QuestionTypeEnum;
  question: string;
  propositions: string[];
};

export type GetExamQueryResult = {
  id: string;
  name: string;
  resume?: GetExamExamQuestion;
  questions: GetExamExamQuestion[];
};

export type GetExamQueryPayload = {
  trainingId: string;
  courseId: string;
  examId: string;
};

export class GetExamQuery extends Query<GetExamQueryResult> {
  constructor(public readonly payload: GetExamQueryPayload) {
    super();
  }
}
