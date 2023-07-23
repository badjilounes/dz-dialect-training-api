import { Inject } from '@nestjs/common';

import { ExamAggregate } from '../../../aggregates/exam.aggregate';
import { CourseExamNameAlreadyExistError } from '../../../errors/course-exam-name-already-exist-error';
import { ExamCommandRepository } from '../../../repositories/exam-command-repository';
import { EXAM_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { AnswerValueType } from '../../../value-types/answer.value-type';

import { CreateExamCommand, CreateExamCommandResult } from './create-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateExamCommand)
export class CreateExamHandler implements ICommandHandler<CreateExamCommand> {
  constructor(
    @Inject(EXAM_COMMAND_REPOSITORY)
    private readonly courseExamCommandRepository: ExamCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateExamCommand): Promise<CreateExamCommandResult> {
    const { name, courseId, questions } = payload;

    const existingExam = await this.courseExamCommandRepository.findCourseExamByName(courseId, name);
    if (existingExam) {
      throw new CourseExamNameAlreadyExistError(courseId, name);
    }

    const examId = this.uuidGenerator.generate();
    const exam = ExamAggregate.create({
      id: examId,
      name,
      courseId,
      questions: questions.map((q) => ({
        id: this.uuidGenerator.generate(),
        examId,
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: AnswerValueType.from({ value: q.answer, questionType: q.type }),
      })),
    });

    this.eventPublisher.mergeObjectContext(exam);

    await this.courseExamCommandRepository.persist(exam);

    return {
      id: exam.id,
      name: exam.name,
      questions: exam.questions,
    };
  }
}
