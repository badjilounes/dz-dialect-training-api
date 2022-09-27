import { mock, MockProxy } from 'jest-mock-extended';

import { ValidateResponseHandler } from './validate-response.handler';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { ExamCopyAggregate } from 'business/training/domain/aggregates/exam-copy.aggregate';
import { ExamQuestionEntity } from 'business/training/domain/entities/question.entity';
import { ResponseEntity } from 'business/training/domain/entities/response.entity';
import { QuestionNotFoundError } from 'business/training/domain/errors/question-not-found-error';
import { ExamCopyCommandRepository } from 'business/training/domain/repositories/exam-copy-command-repository';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

describe('Validate user response', () => {
  let handler: ValidateResponseHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';
  const response = ['response'];

  const examCopyId = 'examCopyId';
  const responseId = 'responseId';

  let examCopy: ExamCopyAggregate;
  let examQuestion: ExamQuestionEntity;
  let examResponse: ResponseEntity;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new ValidateResponseHandler(
      examCopyCommandRepository,
      trainingCommandRepository,
      uuidGenerator,
      eventPublisher,
    );

    examQuestion = ExamQuestionEntity.from({
      id: questionId,
      examId,
      type: QuestionTypeEnum.WORD_LIST,
      question: 'question',
      answer: AnswerValueType.createWordList({ value: ['answer'] }),
      propositions: ['proposition1', 'proposition2'],
    });
    trainingCommandRepository.findExamQuestion.mockResolvedValue(examQuestion);

    examCopy = ExamCopyAggregate.from({
      id: examCopyId,
      examId,
      responses: [],
    });
    examCopyCommandRepository.findExamCopy.mockResolvedValue(examCopy);

    examResponse = ResponseEntity.from({
      id: responseId,
      question: examQuestion,
      response: AnswerValueType.createWordList({ value: response }),
    });
  });

  it('should throw if question does not exist in given training exam', async () => {
    trainingCommandRepository.findExamQuestion.mockResolvedValue(undefined);

    await expect(
      handler.execute({
        trainingId,
        examId,
        questionId,
        response,
      }),
    ).rejects.toStrictEqual(new QuestionNotFoundError(questionId));
  });

  it('should create a copy for given exam if no copy exist for this exam', async () => {
    examCopyCommandRepository.findExamCopy.mockResolvedValue(undefined);

    await handler.execute({ trainingId, examId, questionId, response });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.objectContaining({ examId }));
  });

  it('should write the response on the copy for given exam', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);
    const expectedResponse = ResponseEntity.from({
      id: responseId,
      question: examQuestion,
      response: AnswerValueType.createWordList({ value: response }),
    });

    await handler.execute({ trainingId, examId, questionId, response });

    expect(examCopy.responses).toEqual([expectedResponse]);
  });

  it('should save the the copy with the response added', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);

    await handler.execute({ trainingId, examId, questionId, response });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(
      expect.objectContaining({
        id: examCopyId,
        examId,
        responses: [
          ResponseEntity.from({
            id: responseId,
            question: examQuestion,
            response: AnswerValueType.createWordList({ value: response }),
          }),
        ],
      }),
    );
  });

  it('should save an invalid response', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);

    const result = await handler.execute({ trainingId, examId, questionId, response: examResponse.response.value });

    expect(result).toEqual({
      valid: false,
      response: examResponse.response.formattedValue,
      answer: examQuestion.answer.formattedValue,
    });
  });

  it('should save a valid response', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);

    const result = await handler.execute({ trainingId, examId, questionId, response: examQuestion.answer.value });

    expect(result).toEqual({
      valid: true,
      response: examQuestion.answer.formattedValue,
      answer: examQuestion.answer.formattedValue,
    });
  });
});
