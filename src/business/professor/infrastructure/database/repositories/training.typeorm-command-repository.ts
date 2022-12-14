import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { TrainingCreatedEvent } from '../../../domain/events/training-created-event';
import { TrainingExamQuestion } from '../entities/training-exam-question.entity';

import { ExamQuestionEntity } from '@business/professor/domain/entities/question.entity';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/professor/domain/value-types/answer.value-type';
import { TrainingExam } from '@business/professor/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';
import { trainingToTrainingAggregate } from '@business/professor/infrastructure/mappers/training.mapper';
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

  async findTrainingById(id: string): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { id },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });

    if (!training) {
      return undefined;
    }

    return trainingToTrainingAggregate(training);
  }

  private async createTrainingPresentation(event: TrainingCreatedEvent): Promise<Training> {
    const [exam] = event.training.exams;

    const trainingExamQuestions = exam.questions.map((question, index) =>
      this.examQuestionRepository.create({
        id: question.id,
        exam: { id: exam.id },
        type: question.type,
        question: question.question,
        answer: question.answer.value,
        propositions: question.propositions,
        order: index + 1,
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
      chapter: event.training.chapterId ? { id: event.training.chapterId } : null,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [trainingExam],
    });

    return this.repository.save(training);
  }
}
