import { mock, MockProxy } from 'jest-mock-extended';

import { GetExamResultQueryHandler } from './get-exam-result.handler';

import { ExamCopyQuestionResponseEntity } from '@business/student/domain/entities/exam-copy-question-response.entity';
import { ExamCopyQuestionEntity } from '@business/student/domain/entities/exam-copy-question.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { TrainingExamNotFoundError } from '@business/student/domain/errors/training-exam-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';

describe('Get exm presentation result', () => {
  let handler: GetExamResultQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;
  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;

  let training: Training;
  let examCopy: ExamCopy;

  const examId = 'examId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    examCopyQueryRepository = mock<ExamCopyQueryRepository>();

    handler = new GetExamResultQueryHandler(trainingQueryRepository, examCopyQueryRepository);

    training = {
      id: 'trainingId',
      chapterId: 'chapterId',
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: 'questionId',
              order: 1,
              type: QuestionTypeEnum.WORD_LIST,
              question: 'el makla rahi el dekhel',
              answer: ["la nourriture est à l'intérieur"],
              propositions: [
                'part',
                'avec',
                'nous',
                'intérieur',
                'quelque',
                'est',
                'est',
                "l'",
                'nourriture',
                'la',
                'à',
              ],
            },
          ],
        },
      ],
    };
    trainingQueryRepository.findExamById.mockResolvedValue(training.exams[0]);

    examCopy = {
      id: 'examCopyId',
      examId: training.exams[0].id,
      state: ExamCopyStateEnum.COMPLETED,
      questions: [
        ExamCopyQuestionResponseEntity.from({
          id: 'responseId',
          question: ExamCopyQuestionEntity.from({
            id: 'questionId',
            examCopyId: examId,
            type: QuestionTypeEnum.WORD_LIST,
            question: 'el makla rahi el dekhel',
            answer: AnswerValueType.createWordListFromValue("la nourriture est à l'intérieur"),
            propositions: [],
            order: 1,
          }),
          response: AnswerValueType.createWordListFromValue("la nourriture est à l'intérieur"),
        }),
      ],
    };
    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(examCopy);
  });

  it('should throw if exam does not exist for given id', async () => {
    trainingQueryRepository.findExamById.mockResolvedValue(undefined);

    await expect(handler.execute({ payload: { examId } })).rejects.toStrictEqual(new TrainingExamNotFoundError(examId));
  });

  it('should throw if the exam is not finished', async () => {
    examCopy.state = ExamCopyStateEnum.IN_PROGRESS;
    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(examCopy);

    await expect(handler.execute({ payload: { examId } })).rejects.toStrictEqual(new ExamCopyNotFinishedError());
  });

  it('should return the exam result', async () => {
    const result = await handler.execute({ payload: { examId } });

    expect(result).toStrictEqual({
      note: 1,
      total: 1,
    });
  });
});
