import { courseToCourseAggregate } from './course.mapper';

import { TrainingAggregate } from '@business/professor/domain/aggregates/training.aggregate';
import { Training } from '@business/professor/infrastructure/database/entities/training.entity';

export function trainingToTrainingAggregate(training: Training): TrainingAggregate {
  return TrainingAggregate.from({
    id: training.id,
    name: training.name,
    description: training.description,
    isPresentation: training.isPresentation,
    courses: training.courses.map(courseToCourseAggregate),
  });
}
