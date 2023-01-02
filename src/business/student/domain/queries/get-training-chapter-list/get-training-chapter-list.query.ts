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
  questions: GetExamExamQuestion[];
};

type GetTrainingChapterListTrainingResult = {
  id: string;
  chapterId?: string;
  exams: GetExamQueryResult[];
};

type GetTrainingChapterListChapterResult = {
  id: string;
  name: string;
  description: string;
};

export type GetTrainingChapterListQueryResult = {
  chapter: GetTrainingChapterListChapterResult;
  trainingList: GetTrainingChapterListTrainingResult[];
};

export class GetTrainingChapterListQuery extends Query<GetTrainingChapterListQueryResult[]> {}
