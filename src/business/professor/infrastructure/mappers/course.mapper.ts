import { CourseAggregate } from '../../domain/aggregates/course.aggregate';
import { TrainingCourse } from '../database/entities/training-course.entity';

import { examToExamAggregate } from './exam.mapper';

export function courseToCourseAggregate(course: TrainingCourse): CourseAggregate {
  return CourseAggregate.from({
    id: course.id,
    name: course.name,
    description: course.description,
    trainingId: course.training.id,
    exams: course.exams.map(examToExamAggregate),
  });
}
