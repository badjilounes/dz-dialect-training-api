import { mock, MockProxy } from 'jest-mock-extended';

import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '../../repositories/exam-copy-query-repository';

import { GetPresentationExamIdQueryHandler } from './get-presentation-exam-id.handler';
import { GetPresentationExamQueryPayload } from './get-presentation-exam-id.query';

describe('Get exam copy', () => {
  let handler: GetPresentationExamIdQueryHandler;

  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;

  let examCopy: ExamCopy;

  let payload: GetPresentationExamQueryPayload;

  const examCopyId = 'examCopyId';
  const examId = 'examId';

  beforeEach(() => {
    examCopyQueryRepository = mock<ExamCopyQueryRepository>();

    handler = new GetPresentationExamIdQueryHandler(examCopyQueryRepository);

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
