import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { TrainingCreatedEvent } from '../../../domain/events/training-created-event';
import { TrainingExamQuestion } from '../entities/training-exam-question.entity';

import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';
import { ExamQuestionEntity } from 'business/training/domain/entities/question.entity';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';
import { TrainingExam } from 'business/training/infrastructure/database/entities/training-exam.entity';
import { Training } from 'business/training/infrastructure/database/entities/training.entity';
import { trainingToTrainingAggregate } from 'business/training/infrastructure/mappers/training.mapper';

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
    this.register(TrainingCreatedEvent, this.createTrainingPresentation);
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

  private async createTrainingPresentation(event: TrainingCreatedEvent): Promise<Training> {
    const [exam] = event.training.exams;

    const trainingExamQuestions = exam.questions.map((question, order) =>
      this.examQuestionRepository.create({
        id: question.id,
        exam: { id: exam.id },
        type: question.type,
        question: question.question,
        answer: question.answer.value,
        propositions: question.propositions,
        order,
      }),
    );

    const trainingExam = this.examRepository.create({
      id: exam.id,
      order: 0,
      training: { id: event.training.id },
      name: exam.name,
      questions: trainingExamQuestions,
    });

    const training = this.repository.create({
      id: event.training.id,
      category: event.training.category,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [trainingExam],
    });

    return this.repository.save(training);
  }
}
