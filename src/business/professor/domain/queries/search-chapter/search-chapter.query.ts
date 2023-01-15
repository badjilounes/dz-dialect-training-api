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

type ChapterQueryResult = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SearchChapterQueryResult = {
  elements: ChapterQueryResult[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export class SearchChapterQuery extends Query<SearchChapterQueryResult> {
  constructor(public readonly pageIndex: number, public readonly pageSize: number, public readonly search?: string) {
    super();
  }
}
