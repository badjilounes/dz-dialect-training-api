import { mock, MockProxy } from 'jest-mock-extended';

import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '../../repositories/exam-copy-query-repository';

import { GetExamCopyQueryHandler } from './get-exam-copy.handler';
import { GetExamQueryPayload } from './get-exam-copy.query';

describe('Get exam copy', () => {
  let handler: GetExamCopyQueryHandler;

  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;

  let examCopy: ExamCopy;

  let payload: GetExamQueryPayload;

  const examCopyId = 'examCopyId';
  const examId = 'examId';

  beforeEach(() => {
    examCopyQueryRepository = mock<ExamCopyQueryRepository>();

    handler = new GetExamCopyQueryHandler(examCopyQueryRepository);

    examCopy = {
      id: examCopyId,
      examId,
      state: ExamCopyStateEnum.IN_PROGRESS,
      currentQuestionIndex: 0,
      questions: [],
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

  it('should return exam copy corresponding to given exam identifier', async () => {
    const result = await handler.execute({ payload });

    expect(result).toStrictEqual(examCopy);
  });
});
