import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

import { CourseAggregate } from '../../../domain/aggregates/course.aggregate';
import { CourseDeletedEvent } from '../../../domain/events/course/course-deleted-event';
import { CourseReorderedEvent } from '../../../domain/events/course/course-reordered-event';
import { CourseUpdatedEvent } from '../../../domain/events/course/course-updated-event';
import { courseToCourseAggregate } from '../../mappers/course.mapper';
import { TrainingCourse } from '../entities/training-course.entity';

import { CourseCreatedEvent } from '@business/professor/domain/events/course/course-created-event';
import { CourseCommandRepository } from '@business/professor/domain/repositories/course-command-repository';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class CourseTypeormCommandRepository
  extends BaseTypeormCommandRepository<CourseAggregate>
  implements CourseCommandRepository
{
  constructor(
    @InjectRepository(TrainingCourse)
    protected readonly courseRepository: Repository<TrainingCourse>,

    protected readonly context: AppContextService,
  ) {
    super(courseRepository, context);
    this.register(CourseCreatedEvent, this.createCourse);
    this.register(CourseUpdatedEvent, this.updateCourse);
    this.register(CourseDeletedEvent, this.deleteCourse);
    this.register(CourseReorderedEvent, this.reorderCourse);
  }
  async findByIdList(idList: string[]): Promise<CourseAggregate[]> {
    const courses = idList.length
      ? await this.courseRepository.find({ where: { id: In(idList) }, relations: ['training'] })
      : [];
    return courses.map(courseToCourseAggregate);
  }

  public async findCourseById(id: string): Promise<CourseAggregate | undefined> {
    const course = await this.courseRepository.findOne({ where: { id }, relations: ['training'] });

    if (!course) {
      return undefined;
    }

    return courseToCourseAggregate(course);
  }

  async findTrainingCourseByName(trainingId: string, name: string, id?: string): Promise<CourseAggregate | undefined> {
    const course = id
      ? await this.courseRepository.findOne({
          where: { training: { id: trainingId }, name, id: Not(id) },
          relations: ['training'],
        })
      : await this.courseRepository.findOne({ where: { training: { id: trainingId }, name }, relations: ['training'] });

    if (!course) {
      return undefined;
    }

    return courseToCourseAggregate(course);
  }

  private async createCourse(event: CourseCreatedEvent): Promise<TrainingCourse> {
    const course = this.repository.create({
      id: event.course.id,
      name: event.course.name,
      description: event.course.description,
      training: { id: event.course.trainingId },
    });
    return this.repository.save(course);
  }

  private async updateCourse(event: CourseUpdatedEvent): Promise<void> {
    await this.courseRepository.update(event.id, event.payload);
  }

  private async deleteCourse(event: CourseDeletedEvent): Promise<void> {
    await this.courseRepository.delete(event.id);
  }

  private async reorderCourse(event: CourseReorderedEvent): Promise<void> {
    await this.courseRepository.update(event.id, { order: event.order });
  }
}
