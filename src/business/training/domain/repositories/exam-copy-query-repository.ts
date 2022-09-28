import { ResponseEntity } from '@business/training/domain/entities/response.entity';
import { ExamCopyStateEnum } from '@business/training/domain/enums/exam-copy-state.enum';

export type ExamCopy = {
  id: string;
  examId: string;
  responses: ResponseEntity[];
  state: ExamCopyStateEnum;
};

export interface ExamCopyQueryRepository {
  findExamCopy(examId: string): Promise<ExamCopy | undefined>;
}
