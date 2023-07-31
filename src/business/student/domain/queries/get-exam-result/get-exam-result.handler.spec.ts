import { mock, MockProxy } from 'jest-mock-extended';

import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';
import { ExamCopyNotFinishedError } from '../../errors/exam-copy-not-finished-error';
import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '../../repositories/exam-copy-query-repository';

import { GetExamResultQueryHandler } from './get-exam-result.handler';
import { GetExamResultQueryPayload } from './get-exam-result.query';

describe('Get exam result', () => {
  let handler: GetExamResultQueryHandler;

  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;

  let examCopy: ExamCopy;

  let payload: GetExamResultQueryPayload;

  const examCopyId = 'examCopyId';
  const examId = 'examId';

  beforeEach(() => {
    examCopyQueryRepository = mock<ExamCopyQueryRepository>();

    handler = new GetExamResultQueryHandler(examCopyQueryRepository);

    examCopy = {
      id: examCopyId,
      examId,
      state: ExamCopyStateEnum.COMPLETED,
      currentQuestionIndex: 0,
      questions: [
        {
          id: 'questionId',
          type: QuestionTypeEnum.SINGLE_CHOICE,
          order: 1,
          question: 'question',
          answer: 'answer',
          propositions: ['proposition1', 'proposition2'],
          response: {
            id: 'responseId',
            value: 'answer',
            valid: true,
            createdAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'questionId',
          type: QuestionTypeEnum.SINGLE_CHOICE,
          order: 1,
          question: 'question',
          answer: 'answer',
          propositions: ['proposition1', 'proposition2'],
          response: {
            id: 'responseId',
            value: 'answer',
            valid: false,
            createdAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'questionId',
          type: QuestionTypeEnum.SINGLE_CHOICE,
          order: 1,
          question: 'question',
          answer: 'answer',
          propositions: ['proposition1', 'proposition2'],
          response: {
            id: 'responseId',
            value: 'answer',
            valid: false,
            createdAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'questionId',
          type: QuestionTypeEnum.SINGLE_CHOICE,
          order: 1,
          question: 'question',
          answer: 'answer',
          propositions: ['proposition1', 'proposition2'],
          response: {
            id: 'responseId',
            value: 'answer',
            valid: false,
            createdAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'questionId',
          type: QuestionTypeEnum.SINGLE_CHOICE,
          order: 1,
          question: 'question',
          answer: 'answer',
          propositions: ['proposition1', 'proposition2'],
          response: {
            id: 'responseId',
            value: 'answer',
            valid: false,
            createdAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payload = {
      examId,
    };

    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(examCopy);
  });

  it('should throw if no exam copy exist for given exam identifier', async () => {
    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(undefined);

    await expect(handler.execute({ payload })).rejects.toStrictEqual(new ExamCopyNotFoundError(payload.examId));
  });

  it('should throw if exam copy for given exam identifier is not completed', async () => {
    examCopy.state = ExamCopyStateEnum.IN_PROGRESS;
    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(examCopy);

    await expect(handler.execute({ payload })).rejects.toStrictEqual(new ExamCopyNotFinishedError(payload.examId));
  });

  it('should return exam copy result with "note" equals to the number of valid responses', async () => {
    const result = await handler.execute({ payload });

    expect(result).toStrictEqual({
      note: 1,
      total: examCopy.questions.length,
    });
  });
});
