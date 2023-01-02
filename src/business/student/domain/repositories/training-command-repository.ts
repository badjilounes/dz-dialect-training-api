import { TrainingAggregate } from '../aggregates/training.aggregate';

import { ExamAggregate } from '@business/student/domain/aggregates/exam.aggregate';
import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { IBaseCommandRepository } from '@ddd/infrastructure/base.command-repository.interface';

export interface TrainingCommandRepository extends IBaseCommandRepository<TrainingAggregate> {
  findTrainingById(id: string): Promise<TrainingAggregate | undefined>;
  findTrainingPresentationExam(): Promise<ExamAggregate | undefined>;
  findExamById(id: string): Promise<ExamAggregate | undefined>;
  findExamQuestions(trainingId: string, examId: string): Promise<ExamQuestionEntity[]>;
}
