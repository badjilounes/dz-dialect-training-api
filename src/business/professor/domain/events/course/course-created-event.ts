import { CourseAggregate } from '../../aggregates/course.aggregate';

export class CourseCreatedEvent {
  constructor(public course: CourseAggregate) {}
}
