import { TrainingAggregate } from '../aggregates/training.aggregate';

import { ExamQuestionEntity } from '@business/professor/domain/entities/question.entity';
import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  findPresentation(): Promise<TrainingAggregate | undefined>;
  findExamQuestions(trainingId: string, examId: string): Promise<ExamQuestionEntity[]>;
}
