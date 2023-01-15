type Chapter = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type ChapterPaginatedResult = {
  elements: Chapter[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export interface ChapterQueryRepository {
  searchChapter(pageIndex: number, pageSize: number, search?: string): Promise<ChapterPaginatedResult>;
}
