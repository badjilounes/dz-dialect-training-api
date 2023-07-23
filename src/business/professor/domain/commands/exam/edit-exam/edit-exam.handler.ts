import { Inject } from '@nestjs/common';

import { UUID_GENERATOR } from '../../../../../../shared/ddd/domain/uuid/tokens';
import { UuidGenerator } from '../../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { ExamAggregate } from '../../../aggregates/exam.aggregate';
import { CourseExamNameAlreadyExistError } from '../../../errors/course-exam-name-already-exist-error';
import { CourseExamNotFoundError } from '../../../errors/course-exam-not-found-error';
import { ExamCommandRepository } from '../../../repositories/exam-command-repository';
import { EXAM_COMMAND_REPOSITORY } from '../../../repositories/tokens';
import { AnswerValueType } from '../../../value-types/answer.value-type';

import { EditExamCommand, EditExamCommandResult } from './edit-exam.command';

import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';

@CommandHandler(EditExamCommand)
export class EditExamHandler implements ICommandHandler<EditExamCommand> {
  constructor(
    @Inject(EXAM_COMMAND_REPOSITORY)
    private readonly courseExamCommandRepository: ExamCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ id, payload }: EditExamCommand): Promise<EditExamCommandResult> {
    const examById = await this.courseExamCommandRepository.findExamById(id);
    if (!examById) {
      throw new CourseExamNotFoundError(id);
    }

    const examByName = await this.courseExamCommandRepository.findCourseExamByName(payload.courseId, payload.name, id);
    if (examByName) {
      throw new CourseExamNameAlreadyExistError(payload.courseId, payload.name);
    }

    let exam = ExamAggregate.from({
      id: examById.id,
      name: examById.name,
      courseId: examById.courseId,
      questions: examById.questions,
    });
    this.eventPublisher.mergeObjectContext(exam);

    exam = exam.update({
      name: payload.name,
      questions: payload.questions.map((q) => ({
        id: q.id || this.uuidGenerator.generate(),
        examId: exam.id,
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: AnswerValueType.from({ questionType: q.type, value: q.answer }),
      })),
    });

    await this.courseExamCommandRepository.persist(exam);

    return {
      id: exam.id,
      name: exam.name,
      questions: exam.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        propositions: q.propositions,
        answer: q.answer.value,
      })),
    };
  }
}
