import { mock, MockProxy } from 'jest-mock-extended';

import { ValidateResponseHandler } from './validate-response.handler';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyQuestionResponseEntity } from '@business/student/domain/entities/exam-copy-question-response.entity';
import { ExamCopyQuestionEntity } from '@business/student/domain/entities/exam-copy-question.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamCopyQuestionNotFoundError } from '@business/student/domain/errors/exam-copy-question-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

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
  let examQuestion: ExamCopyQuestionEntity;
  let examResponse: ExamCopyQuestionResponseEntity;

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

    examQuestion = ExamCopyQuestionEntity.from({
      id: questionId,
      examCopyId: examId,
      type: QuestionTypeEnum.WORD_LIST,
      question: 'question',
      answer: AnswerValueType.createWordList({ value: ['answer'] }),
      propositions: ['proposition1', 'proposition2'],
      order: 1,
    });
    trainingCommandRepository.findExamQuestions.mockResolvedValue([examQuestion]);

    examCopy = ExamCopyAggregate.from({
      id: examCopyId,
      examId,
      questions: [],
      state: ExamCopyStateEnum.IN_PROGRESS,
    });
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(examCopy);

    examResponse = ExamCopyQuestionResponseEntity.from({
      id: responseId,
      question: examQuestion,
      response: AnswerValueType.createWordList({ value: response }),
    });
  });

  it('should throw if question does not exist in given training exam', async () => {
    trainingCommandRepository.findExamQuestions.mockResolvedValue([]);

    await expect(
      handler.execute({
        trainingId,
        examId,
        questionId,
        response,
      }),
    ).rejects.toStrictEqual(new ExamCopyQuestionNotFoundError(questionId));
  });

  it('should create a copy for given exam if no copy exist for this exam', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(undefined);

    await handler.execute({ trainingId, examId, questionId, response });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.objectContaining({ examId }));
  });

  it('should write the response on the copy for given exam', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);
    const expectedResponse = ExamCopyQuestionResponseEntity.from({
      id: responseId,
      question: examQuestion,
      response: AnswerValueType.createWordList({ value: response }),
    });

    await handler.execute({ trainingId, examId, questionId, response });

    expect(examCopy.questions).toEqual([expectedResponse]);
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
          ExamCopyQuestionResponseEntity.from({
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

  it('should mark the exam copy as completed writing the last question response', async () => {
    uuidGenerator.generate.mockReturnValue(responseId);

    await handler.execute({ trainingId, examId, questionId, response: examQuestion.answer.value });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(
      expect.objectContaining({
        state: ExamCopyStateEnum.COMPLETED,
      }),
    );
  });
});
