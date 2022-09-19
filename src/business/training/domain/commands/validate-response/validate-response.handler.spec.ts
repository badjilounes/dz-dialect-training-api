import { mock, MockProxy } from 'jest-mock-extended';

import { ValidateResponseHandler } from './validate-response.handler';

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
  const response = 'response';

  const examCopyId = 'examCopyId';
  const responseId = 'responseId';

  let examCopy: ExamCopyAggregate;
  let examQuestion: ExamQuestionEntity;

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
      question: 'question',
      answer: 'answer',
      propositions: ['proposition1', 'proposition2'],
    });
    trainingCommandRepository.findExamQuestion.mockResolvedValue(examQuestion);

    examCopy = ExamCopyAggregate.from({
      id: examCopyId,
      examId,
      responses: [],
    });
    examCopyCommandRepository.findExamCopy.mockResolvedValue(examCopy);
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
      response,
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
            response,
          }),
        ],
      }),
    );
  });
});
