import { CourseEntity } from '../../domain/entities/course.entity';
import { TrainingCourse } from '../database/entities/training-course.entity';

import { examToExamAggregate } from './exam.mapper';

export function courseToCourseEntity(course: TrainingCourse): CourseEntity {
  return CourseEntity.from({
    id: course.id,
    name: course.name,
    description: course.description,
    trainingId: course.training.id,
    exams: course.exams.map(examToExamAggregate),
  });
}
