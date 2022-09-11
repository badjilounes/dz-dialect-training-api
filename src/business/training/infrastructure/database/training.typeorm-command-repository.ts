import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingAggregate } from '../../domain/aggregates/training.aggregate';
import { TrainingCreatedEvent } from '../../domain/events/training-created-event';
import { TrainingCommandRepository } from '../../domain/repositories/training-translation-exam-command-repository';

import { TrainingExamQuestion } from './training-exam-question.entity';
import { TrainingExam } from './training-exam.entity';
import { Training } from './training.entity';

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
    super(examRepository, context);
    this.register(TrainingCreatedEvent, this.createTrainingPresentation);
  }

  async findPresentation(): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { name: 'presentation' },
      relations: ['exams', 'exams.questions'],
    });

    if (!training) {
      return undefined;
    }

    return TrainingAggregate.from({
      id: training.id,
      name: training.name,
      fromLanguage: training.fromLanguage,
      learningLanguage: training.learningLanguage,
      exams: training.exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        type: exam.type,
        trainingId: training.id,
        questions: exam.questions.map((question) => ({
          id: question.id,
          examId: exam.id,
          question: question.question,
          answer: question.answer,
          propositions: question.propositions,
        })),
      })),
    });
  }

  private async createTrainingPresentation(event: TrainingCreatedEvent): Promise<Training> {
    const [exam] = event.training.exams;

    const trainingExamQuestions = exam.questions.map((question, order) =>
      this.examQuestionRepository.create({
        id: question.id,
        exam: { id: exam.id },
        question: question.question,
        answer: question.answer,
        propositions: question.propositions,
        order,
      }),
    );

    const trainingExam = this.examRepository.create({
      id: exam.id,
      training: { id: event.training.id },
      name: exam.name,
      type: exam.type,
      questions: trainingExamQuestions,
    });

    const training = this.repository.create({
      id: event.training.id,
      name: event.training.name,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [trainingExam],
    });

    return this.repository.save(training);
  }
}
