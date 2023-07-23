import { TrainingAggregate } from '../aggregates/training.aggregate';
import { LanguageEntity } from '../entities/language.entity';

import { ExamQuestionEntity } from '@business/professor/domain/entities/question.entity';
import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  findTrainingById(id: string): Promise<TrainingAggregate | undefined>;
  findByIdList(idList: string[]): Promise<TrainingAggregate[]>;
  findTrainingByName(name: string, id?: string): Promise<TrainingAggregate | undefined>;
  findTrainingLanguage(from: string, learning: string): Promise<LanguageEntity | undefined>;
  findExamQuestions(trainingId: string, examId: string): Promise<ExamQuestionEntity[]>;
}
