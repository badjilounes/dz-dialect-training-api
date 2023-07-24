import { CourseEntity } from '../../entities/course.entity';

export class CourseCreatedEvent {
  constructor(public course: CourseEntity) {}
}
