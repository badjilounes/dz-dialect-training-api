import { courseToCourseEntity } from './course.mapper';

import { TrainingAggregate } from '@business/student/domain/aggregates/training.aggregate';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';

export function trainingToTrainingAggregate(training: Training): TrainingAggregate {
  return TrainingAggregate.from({
    id: training.id,
    name: training.name,
    description: training.description,
    isPresentation: training.isPresentation,
    courses: training.courses.map(courseToCourseEntity),
  });
}
