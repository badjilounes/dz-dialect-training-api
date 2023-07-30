import { EventPublisher } from '@nestjs/cqrs';
import { mock, MockProxy } from 'jest-mock-extended';

import { UuidGenerator } from '../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { ExamCopyAggregate, ExamCopyAggregateProps } from '../../aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';
import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ExamCopyQuestionAlreadyAnsweredError } from '../../errors/exam-copy-question-already-answered-error';
import { ExamCopyQuestionNotFoundError } from '../../errors/exam-copy-question-not-found-error';
import { ExamCopyResponseNotSavedError } from '../../errors/exam-copy-response-not-saved-error';
import { ExamCopyResponseAddedEvent } from '../../events/exam-copy-response-added-event';
import { ProfessorGateway } from '../../gateways/professor-gateway';
import { ExamCopyCommandRepository } from '../../repositories/exam-copy-command-repository';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { ValidateResponseCommand } from './validate-response.command';
import { ValidateResponseHandler } from './validate-response.handler';

describe('Validate response', () => {
  let handler: ValidateResponseHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let professorGateway: MockProxy<ProfessorGateway>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const examId = 'examId';
  const questionId = 'questionId';
  const examCopyId = 'examCopyId';
  const response = ['answer1'];

  let payload: ValidateResponseCommand;

  let examCopy: ExamCopyAggregate;
  let examCopyProps: ExamCopyAggregateProps;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    professorGateway = mock<ProfessorGateway>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new ValidateResponseHandler(examCopyCommandRepository, professorGateway, uuidGenerator, eventPublisher);

    payload = { examCopyId, questionId, response };

    examCopyProps = {
      id: examCopyId,
      examId,
      state: ExamCopyStateEnum.IN_PROGRESS,
      questions: [
        {
          id: questionId,
          examCopyId,
          examQuestionId: questionId,
          type: QuestionTypeEnum.MULTIPLE_CHOICE,
          order: 1,
          question: 'question',
          answer: AnswerValueType.from({
            questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
            value: ['answer1'],
          }),
          response: undefined,
          propositions: ['proposition1'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      currentQuestionIndex: 0,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };
    examCopy = ExamCopyAggregate.from(examCopyProps);

    examCopyCommandRepository.findExamCopyById.mockResolvedValue(examCopy);
  });

  it('should throw if no exam copy exist for given identifier', async () => {
    examCopyCommandRepository.findExamCopyById.mockResolvedValue(undefined);

    await expect(handler.execute(payload)).rejects.toStrictEqual(new ExamCopyNotFoundError(examCopyId));
  });

  it('should throw if exam copy does not have any question with given identifier', async () => {
    payload = { ...payload, questionId: 'unknownQuestionId' };

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new ExamCopyQuestionNotFoundError(payload.examCopyId, payload.questionId),
    );
  });

  it('should throw if exam copy question is already answered', async () => {
    examCopy.questions[0].writeResponse({
      id: 'responseId',
      questionId,
      answer: AnswerValueType.from({
        questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
        value: ['answer1'],
      }),
      response: AnswerValueType.from({
        questionType: QuestionTypeEnum.MULTIPLE_CHOICE,
        value: ['answer1'],
      }),
      createdAt: new Date(),
    });

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new ExamCopyQuestionAlreadyAnsweredError(examCopyId, questionId),
    );
  });

  it('should throw if the response has not been saved', async () => {
    examCopy.writeQuestionResponse = jest.fn();

    await expect(handler.execute(payload)).rejects.toStrictEqual(
      new ExamCopyResponseNotSavedError(examCopyId, questionId, 'answer1'),
    );
  });

  it('should validate given response', async () => {
    const result = await handler.execute(payload);

    expect(result).toEqual({
      valid: true,
      response: 'answer1',
      answer: 'answer1',
      nextQuestionIndex: 1,
      examCopyState: ExamCopyStateEnum.COMPLETED,
    });
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(examCopy);
    expect(examCopy.getUncommittedEvents()).toEqual(expect.arrayContaining([expect.any(ExamCopyResponseAddedEvent)]));
  });
});
