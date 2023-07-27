import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { mock, MockProxy } from 'jest-mock-extended';

import { GetExerciseListQueryHandler } from './get-exercise-list.handler';

import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { TrainingExamNotFoundError } from '@business/student/domain/errors/training-exam-not-found-error';
import { ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { AppContextService } from '@core/context/app-context.service';

describe('Get presentation', () => {
  let handler: GetExerciseListQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;
  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;
  let context: MockProxy<AppContextService>;

  let training: Training;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    trainingQueryRepository.findExamById.mockResolvedValue(undefined);

    examCopyQueryRepository = mock<ExamCopyQueryRepository>();
    examCopyQueryRepository.findExamCopyByExamId.mockResolvedValue(undefined);

    context = mock<AppContextService>({ isUserAuthenticated: false });

    handler = new GetExerciseListQueryHandler(trainingQueryRepository, examCopyQueryRepository, context);

    training = {
      id: trainingId,
      chapterId: 'chapterId',
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
              type: QuestionTypeEnum.WORD_LIST,
              order: 1,
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
  });

  it('should throw if no exam exists for given id', async () => {
    await expect(handler.execute({ payload: { examId } })).rejects.toStrictEqual(new TrainingExamNotFoundError(examId));
  });

  it('should return the exam', async () => {
    trainingQueryRepository.findExamById.mockResolvedValue(training.exams[0]);

    const result = await handler.execute({ payload: { examId } });

    expect(result).toEqual({
      id: training.exams[0].id,
      name: training.exams[0].name,
      questions: training.exams[0].questions.map((question) => ({
        id: question.id,
        type: question.type,
        order: question.order,
        question: question.question,
        propositions: question.propositions,
      })),
    });
  });
});
