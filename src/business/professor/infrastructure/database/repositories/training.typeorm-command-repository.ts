import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { TrainingCourseAddedEvent } from '../../../domain/events/training-course-added-event';
import { TrainingCourseDeletedEvent } from '../../../domain/events/training-course-deleted-event';
import { TrainingCourseExamAddedEvent } from '../../../domain/events/training-course-exam-added-event';
import { TrainingCourseExamDeletedEvent } from '../../../domain/events/training-course-exam-deleted-event';
import { TrainingCourseExamReorderedEvent } from '../../../domain/events/training-course-exam-reordered-event';
import { TrainingCourseExamUpdatedEvent } from '../../../domain/events/training-course-exam-udpated-event';
import { TrainingCourseReorderedEvent } from '../../../domain/events/training-course-reordered-event';
import { TrainingCourseUpdatedEvent } from '../../../domain/events/training-course-updated-event';
import { TrainingCreatedEvent } from '../../../domain/events/training-created-event';
import { TrainingDeletedEvent } from '../../../domain/events/training-deleted-event';
import { TrainingReorderedEvent } from '../../../domain/events/training-reordered-event';
import { TrainingUpdatedEvent } from '../../../domain/events/training-updated-event';
import { trainingAggregateToTraining } from '../../mappers/training-aggregate-to-training.mapper';
import { TrainingCourseExamQuestion } from '../entities/training-course-exam-question.entity';
import { TrainingCourse } from '../entities/training-course.entity';

import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { TrainingCourseExam } from '@business/professor/infrastructure/database/entities/training-course-exam.entity';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';
import { trainingToTrainingAggregate } from '@business/professor/infrastructure/mappers/training-to-training-aggregate.mapper';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class TrainingTypeormCommandRepository
  extends BaseTypeormCommandRepository<TrainingAggregate>
  implements TrainingCommandRepository
{
  constructor(
    @InjectRepository(Training)
    protected readonly repository: Repository<Training>,

    @InjectRepository(TrainingCourse)
    protected readonly trainingCourseRepository: Repository<TrainingCourse>,

    @InjectRepository(TrainingCourseExam)
    protected readonly examRepository: Repository<TrainingCourseExam>,

    @InjectRepository(TrainingCourseExamQuestion)
    protected readonly examQuestionRepository: Repository<TrainingCourseExamQuestion>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
    this.register(TrainingCreatedEvent, this.createTraining);
    this.register(TrainingUpdatedEvent, this.updateTraining);
    this.register(TrainingDeletedEvent, this.deleteTraining);
    this.register(TrainingReorderedEvent, this.reorderTraining);
    this.register(TrainingCourseAddedEvent, this.addCourse);
    this.register(TrainingCourseUpdatedEvent, this.updateCourse);
    this.register(TrainingCourseDeletedEvent, this.deleteCourse);
    this.register(TrainingCourseReorderedEvent, this.reorderCourses);
    this.register(TrainingCourseExamAddedEvent, this.addCourseExam);
    this.register(TrainingCourseExamUpdatedEvent, this.updateCourseExam);
    this.register(TrainingCourseExamDeletedEvent, this.deleteCourseExam);
    this.register(TrainingCourseExamReorderedEvent, this.reorderCourseExams);
  }

  async findByIdList(ids: string[]): Promise<TrainingAggregate[]> {
    const trainings = await this.repository.find({
      where: { id: In(ids) },
    });

    return trainings.map(trainingToTrainingAggregate);
  }

  async findTrainingById(id: string): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOneBy({ id });

    if (!training) {
      return undefined;
    }

    return trainingToTrainingAggregate(training);
  }

  async getNextOrder(): Promise<number> {
    const [latestTraining] = await this.repository.find({ order: { order: 'DESC' }, take: 1 });
    return (latestTraining?.order ?? 0) + 1;
  }

  async hasTrainingWithName(name: string, trainingId?: string | undefined): Promise<boolean> {
    const countWithSameName = trainingId
      ? await this.repository.count({ where: { name, id: Not(trainingId) } })
      : await this.repository.count({ where: { name } });

    return countWithSameName > 0;
  }

  private async createTraining(event: TrainingCreatedEvent): Promise<Training> {
    return this.persistTrainingFromAggregate(event.training);
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

  private async addCourse(event: TrainingCourseAddedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async updateCourse(event: TrainingCourseUpdatedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async deleteCourse(event: TrainingCourseDeletedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async reorderCourses(event: TrainingCourseReorderedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async addCourseExam(event: TrainingCourseExamAddedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async updateCourseExam(event: TrainingCourseExamUpdatedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async deleteCourseExam(event: TrainingCourseExamDeletedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private async reorderCourseExams(event: TrainingCourseExamReorderedEvent): Promise<void> {
    await this.persistTrainingFromAggregate(event.training);
  }

  private persistTrainingFromAggregate(training: TrainingAggregate): Promise<Training> {
    const trainingEntity = trainingAggregateToTraining(training);
    return this.repository.save(trainingEntity);
  }
}
