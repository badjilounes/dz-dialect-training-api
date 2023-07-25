import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { ExamQuestionEntity } from '../../entities/question.entity';
import { ExamNotFoundError } from '../../errors/exam-not-found-error';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { PROFESSOR_GATEWAY } from '../../gateways/tokens';

import { ValidateResponseCommand, ValidateResponseCommandResult } from './validate-response.command';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionNotFoundError } from '@business/student/domain/errors/question-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EXAM_COPY_COMMAND_REPOSITORY } from '@business/student/domain/repositories/tokens';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(ValidateResponseCommand)
export class ValidateResponseHandler implements ICommandHandler<ValidateResponseCommand> {
  constructor(
    @Inject(EXAM_COPY_COMMAND_REPOSITORY)
    private readonly trainingExamCopyCommandRepository: ExamCopyCommandRepository,
    @Inject(PROFESSOR_GATEWAY)
    private readonly professorGatewway: ProfessorGateway,
    @Inject(UUID_GENERATOR) private readonly uuidGenerator: UuidGenerator,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    trainingId,
    courseId,
    examId,
    questionId,
    response,
  }: ValidateResponseCommand): Promise<ValidateResponseCommandResult> {
    // Find given exam question
    const exam = await this.professorGatewway.getExamById(trainingId, courseId, examId);
    if (!exam) {
      throw new ExamNotFoundError(examId);
    }

    const question = exam.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new QuestionNotFoundError(questionId);
    }

    // Find existing copy of exam otherwise create a new one
    let copy = await this.trainingExamCopyCommandRepository.findExamCopyByExamId(examId);
    if (!copy) {
      copy = ExamCopyAggregate.create({
        id: this.uuidGenerator.generate(),
        examId,
        responses: [],
        state: ExamCopyStateEnum.IN_PROGRESS,
      });
    }
    this.eventPublisher.mergeObjectContext(copy);

    // Write the response for given question
    const responseEntity = copy.writeResponse({
      id: this.uuidGenerator.generate(),
      question: ExamQuestionEntity.from({
        id: question.id,
        examId: question.examId,
        order: question.order,
        type: question.type,
        question: question.question,
        propositions: question.propositions,
        answer: AnswerValueType.from({
          questionType: question.type,
          value: question.answer,
        }),
      }),
      response: AnswerValueType.from({
        questionType: question.type,
        value: response,
      }),
    });

    // If this is the last question, mark the copy as completed
    if (copy.responses.length === exam.questions.length) {
      copy.complete();
    }

    await this.trainingExamCopyCommandRepository.persist(copy);

    return {
      valid: responseEntity.valid,
      response: responseEntity.response.formattedValue,
      answer: responseEntity.answer.formattedValue,
    };
  }
}
