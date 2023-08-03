import { Inject } from '@nestjs/common';

import { UUID_GENERATOR } from '../../../../../../shared/ddd/domain/uuid/tokens';
import { UuidGenerator } from '../../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { TrainingCourseExamNameAlreadyExistError } from '../../../errors/training-course-exam-name-already-exist-error';
import { TrainingCourseExamNotFoundError } from '../../../errors/training-course-exam-not-found-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';
import { AnswerValueType } from '../../../value-types/answer.value-type';

import { EditExamCommand, EditExamCommandResult } from './edit-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditExamCommand)
export class EditExamHandler implements ICommandHandler<EditExamCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: EditExamCommand): Promise<EditExamCommandResult> {
    const { trainingId, courseId, examId } = payload;
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

    const examWithName = course.exams.find((e) => e.name === payload.name && e.id !== examId);
    if (examWithName) {
      throw new TrainingCourseExamNameAlreadyExistError(courseId, payload.name);
    }

    this.eventPublisher.mergeObjectContext(training);

    training.updateCourseExam(course, exam, {
      name: payload.name,
      description: payload.description,
      order: exam.order,
      questions: payload.questions.map((question, index) => ({
        id: question.id ?? this.uuidGenerator.generate(),
        examId: exam.id,
        type: question.type,
        question: question.question,
        answer: AnswerValueType.from({ value: question.answer, questionType: question.type }),
        propositions: question.propositions,
        order: index + 1,
        createdAt: question.createdAt,
        updatedAt: new Date(),
      })),
    });

    await this.trainingCommandRepository.persist(training);

    return {
      id: exam.id,
      name: exam.name,
      description: exam.description,
      questions: exam.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: q.answer.value,
        order: q.order,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
      })),
      order: exam.order,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
