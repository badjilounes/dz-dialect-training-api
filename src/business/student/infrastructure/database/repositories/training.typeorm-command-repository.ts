import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { TrainingExamQuestion } from '../entities/training-exam-question.entity';

import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';
import { trainingToTrainingAggregate } from '@business/student/infrastructure/mappers/training.mapper';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class TrainingTypeormCommandRepository
  extends BaseTypeormCommandRepository<TrainingAggregate>
  implements TrainingCommandRepository
{
  constructor(
    @InjectRepository(Training)
    protected readonly repository: Repository<Training>,

    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    @InjectRepository(TrainingExamQuestion)
    protected readonly examQuestionRepository: Repository<TrainingExamQuestion>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
  }

  async findExamQuestions(trainingId: string, examId: string): Promise<ExamQuestionEntity[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: { exam: { id: examId, training: { id: trainingId } } },
      relations: ['exam'],
      order: { order: 'ASC' },
    });

    return examQuestions.map((examQuestion) =>
      ExamQuestionEntity.from({
        id: examQuestion.id,
        examId: examQuestion.exam.id,
        type: examQuestion.type,
        question: examQuestion.question,
        answer: AnswerValueType.from({ questionType: examQuestion.type, value: examQuestion.answer }),
        propositions: examQuestion.propositions,
      }),
    );
  }

  async findPresentation(): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { category: TrainingCategoryEnum.PRESENTATION },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

    if (!training) {
      return undefined;
    }

    return trainingToTrainingAggregate(training);
  }
}
