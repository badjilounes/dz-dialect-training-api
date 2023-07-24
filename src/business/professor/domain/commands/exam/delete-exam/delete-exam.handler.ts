import { Inject } from '@nestjs/common';

import { TrainingCourseExamNotFoundError } from '../../../errors/training-course-exam-not-found-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';

import { DeleteExamCommand } from './delete-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(DeleteExamCommand)
export class DeleteExamHandler implements ICommandHandler<DeleteExamCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ trainingId, courseId, examId }: DeleteExamCommand): Promise<void> {
    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const course = training.courses.find((c) => c.id === courseId);
    if (!course) {
      throw new TrainingCourseNotFoundError(trainingId, courseId);
    }

    const exam = course.exams.find((e) => e.id === examId);
    if (!exam) {
      throw new TrainingCourseExamNotFoundError(examId);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.deleteCourseExam(course, examId);

    return this.trainingCommandRepository.persist(training);
  }
}
