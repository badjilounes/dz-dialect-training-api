import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { ExamAggregate } from '../../../domain/aggregates/exam.aggregate';
import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { LanguageEntity } from '../../../domain/entities/language.entity';
import { TrainingCreatedEvent } from '../../../domain/events/training/training-created-event';
import { TrainingDeletedEvent } from '../../../domain/events/training/training-deleted-event';
import { TrainingReorderedEvent } from '../../../domain/events/training/training-reordered-event';
import { TrainingUpdatedEvent } from '../../../domain/events/training/training-updated-event';
import { TrainingCourse } from '../entities/training-course.entity';
import { TrainingExamQuestion } from '../entities/training-exam-question.entity';
import { TrainingLanguage } from '../entities/training-language.entity';

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

    @InjectRepository(TrainingLanguage)
    protected readonly trainingLanguageRepository: Repository<TrainingLanguage>,

    @InjectRepository(TrainingCourse)
    protected readonly trainingCourseRepository: Repository<TrainingCourse>,

    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    @InjectRepository(TrainingExamQuestion)
    protected readonly examQuestionRepository: Repository<TrainingExamQuestion>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
    this.register(TrainingCreatedEvent, this.createTraining);
    this.register(TrainingUpdatedEvent, this.updateTraining);
    this.register(TrainingDeletedEvent, this.deleteTraining);
    this.register(TrainingReorderedEvent, this.reorderTraining);
  }

  async findTrainingById(id: string): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { id },
      order: { courses: { order: 'ASC', exams: { order: 'ASC', questions: { order: 'ASC' } } } },
      relations: ['courses.training'],
    });

    if (!training) {
      return undefined;
    }

    return trainingToTrainingAggregate(training);
  }

  async findByIdList(ids: string[]): Promise<TrainingAggregate[]> {
    const trainings = await this.repository.find({
      where: { id: In(ids) },
      relations: ['courses.training', 'courses.exams.course'],
    });

    return trainings.map(trainingToTrainingAggregate);
  }

  async findTrainingByName(name: string, id?: string): Promise<TrainingAggregate | undefined> {
    const course = id
      ? await this.repository.findOne({ where: { name, id: Not(id) } })
      : await this.repository.findOne({ where: { name } });

    if (!course) {
      return undefined;
    }

    return trainingToTrainingAggregate(course);
  }

  async findExamQuestions(examId: string): Promise<ExamQuestionEntity[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: { exam: { id: examId } },
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

  async findTrainingLanguage(from: string, learning: string): Promise<LanguageEntity | undefined> {
    const trainingLanguage = await this.trainingLanguageRepository.findOne({ where: { from, learning } });

    if (!trainingLanguage) {
      return undefined;
    }

    return LanguageEntity.from({
      id: trainingLanguage.id,
      from: trainingLanguage.from,
      learning: trainingLanguage.learning,
    });
  }

  private async createTraining(event: TrainingCreatedEvent): Promise<Training> {
    const courses = event.training.courses.map((course) =>
      this.trainingCourseRepository.create({
        id: course.id,
        name: course.name,
        description: course.description,
        training: { id: event.training.id },
        exams: course.exams.map((exam: ExamAggregate) =>
          this.examRepository.create({
            id: exam.id,
            name: exam.name,
            questions: exam.questions.map((question) =>
              this.examQuestionRepository.create({
                id: question.id,
                type: question.type,
                question: question.question,
                answer: question.answer.value,
                propositions: question.propositions,
              }),
            ),
          }),
        ),
      }),
    );

    const training = this.repository.create({
      id: event.training.id,
      name: event.training.name,
      description: event.training.description,
      isPresentation: event.training.isPresentation,
      courses,
    });

    return this.repository.save(training);
  }

  private async deleteTraining(event: TrainingDeletedEvent): Promise<void> {
    await this.repository.delete(event.id);
  }

  private async reorderTraining(event: TrainingReorderedEvent): Promise<void> {
    await this.repository.update(event.id, { order: event.order });
  }

  private async updateTraining(event: TrainingUpdatedEvent): Promise<void> {
    await this.repository.update(event.id, event.payload);
  }
}
