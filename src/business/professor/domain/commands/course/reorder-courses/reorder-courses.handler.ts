import { Inject } from '@nestjs/common';

import { CourseAggregate } from '../../../aggregates/course.aggregate';
import { CourseCommandRepository } from '../../../repositories/course-command-repository';
import { COURSE_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { ReorderCoursesCommand, ReorderCoursesCommandResult } from './reorder-courses.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(ReorderCoursesCommand)
export class ReorderCoursesHandler implements ICommandHandler<ReorderCoursesCommand> {
  constructor(
    @Inject(COURSE_COMMAND_REPOSITORY)
    private readonly trainingCourseCommandRepository: CourseCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: ReorderCoursesCommand): Promise<ReorderCoursesCommandResult> {
    const courseList = await this.trainingCourseCommandRepository.findByIdList(payload.map((course) => course.id));

    await Promise.all(
      courseList.map((course) => {
        const courseAggregate = CourseAggregate.from({
          id: course.id,
          name: course.name,
          description: course.description,
          trainingId: course.trainingId,
          exams: course.exams,
        });
        this.eventPublisher.mergeObjectContext(courseAggregate);

        const newOrder = payload.find((c) => c.id === courseAggregate.id)?.order;

        if (newOrder !== undefined) {
          courseAggregate.reorder(newOrder);
        }

        return this.trainingCourseCommandRepository.persist(courseAggregate);
      }),
    );
  }
}
