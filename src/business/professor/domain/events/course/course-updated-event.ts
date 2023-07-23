import { UpdateCourseAggregateProps } from '../../aggregates/course.aggregate';

export class CourseUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateCourseAggregateProps) {}
}
