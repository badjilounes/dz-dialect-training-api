import { TrainingAggregate } from '../aggregates/training.aggregate';

import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';
import { ExamQuestionEntity } from 'business/training/domain/entities/question.entity';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  findPresentation(): Promise<TrainingAggregate | undefined>;
  findExamQuestions(trainingId: string, examId: string): Promise<ExamQuestionEntity[]>;
}
