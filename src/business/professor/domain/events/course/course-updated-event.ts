import { UpdateCourseEntityProps } from '../../entities/course.entity';

export class CourseUpdatedEvent {
  constructor(public readonly id: string, public payload: UpdateCourseEntityProps) {}
}
