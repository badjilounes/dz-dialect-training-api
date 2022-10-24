import { ResponseEntity } from '@business/student/domain/entities/response.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';

export type ExamCopy = {
  id: string;
  examId: string;
  responses: ResponseEntity[];
  state: ExamCopyStateEnum;
};

export interface ExamCopyQueryRepository {
  findExamCopy(examId: string): Promise<ExamCopy | undefined>;
}
