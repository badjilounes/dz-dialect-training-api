type Training = {
  id: string;
  name: string;
  description: string;
  isPresentation: boolean;

  courses: {
    id: string;
    name: string;
    description: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }[];

  order: number;
  createdAt: Date;
  updatedAt: Date;
};

type TrainingPaginatedResult = {
  elements: Training[];
  length: number;
  pageIndex: number;
  pageSize: number;
};

export interface TrainingQueryRepository {
  searchTraining(pageIndex: number, pageSize: number, search?: string): Promise<TrainingPaginatedResult>;
}
