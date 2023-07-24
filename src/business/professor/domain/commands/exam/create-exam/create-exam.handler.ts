import { Inject } from '@nestjs/common';

import { ExamEntity } from '../../../entities/exam.entity';
import { TrainingCourseExamNameAlreadyExistError } from '../../../errors/training-course-exam-name-already-exist-error';
import { TrainingCourseNotFoundError } from '../../../errors/training-course-not-found-error';
import { TrainingNotFoundError } from '../../../errors/training-not-found-error';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { TrainingCommandRepository } from '../../../repositories/training-command-repository';
import { AnswerValueType } from '../../../value-types/answer.value-type';

import { CreateExamCommand, CreateExamCommandResult } from './create-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateExamCommand)
export class CreateExamHandler implements ICommandHandler<CreateExamCommand> {
  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateExamCommand): Promise<CreateExamCommandResult> {
    const { trainingId, name, courseId, questions } = payload;

    const training = await this.trainingCommandRepository.findTrainingById(trainingId);
    if (!training) {
      throw new TrainingNotFoundError(trainingId);
    }

    const course = training.courses.find((c) => c.id === courseId);
    if (!course) {
      throw new TrainingCourseNotFoundError(trainingId, courseId);
    }

    const hasExamWithName = course.exams.some((e) => e.name === name);
    if (hasExamWithName) {
      throw new TrainingCourseExamNameAlreadyExistError(courseId, name);
    }

    this.eventPublisher.mergeObjectContext(training);

    const examId = this.uuidGenerator.generate();
    const nextOrder = Math.max(...course.exams.map((e) => e.order), 0) + 1;
    const exam = ExamEntity.create({
      id: examId,
      name,
      courseId,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
      questions: questions.map((q, i) => ({
        id: this.uuidGenerator.generate(),
        examId,
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: AnswerValueType.from({ value: q.answer, questionType: q.type }),
        order: i + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    training.addCourseExam(course, exam);

    await this.trainingCommandRepository.persist(training);

    return {
      id: exam.id,
      name: exam.name,
      questions: exam.questions,
      order: exam.order,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
