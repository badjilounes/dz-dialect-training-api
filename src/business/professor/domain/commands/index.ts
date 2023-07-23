import { CreateExamHandler } from './exam/create-exam/create-exam.handler';
import { DeleteExamHandler } from './exam/delete-exam/delete-exam.handler';
import { EditExamHandler } from './exam/edit-exam/edit-exam.handler';
import { ReorderExamsHandler } from './exam/reorder-exams/reorder-exams.handler';
import { CreateTrainingHandler } from './training/create-training/create-training.handler';
import { DeleteTrainingHandler } from './training/delete-training/delete-training.handler';
import { EditTrainingHandler } from './training/edit-training/edit-training.handler';
import { ReorderTrainingsHandler } from './training/reorder-trainings/reorder-trainings.handler';

import { CreateCourseHandler } from '@business/professor/domain/commands/course/create-course/create-course.handler';
import { DeleteCourseHandler } from '@business/professor/domain/commands/course/delete-course/delete-course.handler';
import { EditCourseHandler } from '@business/professor/domain/commands/course/edit-course/edit-course.handler';
import { ReorderCoursesHandler } from '@business/professor/domain/commands/course/reorder-courses/reorder-courses.handler';

export const TrainingCommandHandlers = [
  CreateTrainingHandler,
  EditTrainingHandler,
  DeleteTrainingHandler,
  ReorderTrainingsHandler,
  CreateCourseHandler,
  EditCourseHandler,
  DeleteCourseHandler,
  ReorderCoursesHandler,
  CreateExamHandler,
  EditExamHandler,
  DeleteExamHandler,
  ReorderExamsHandler,
];
