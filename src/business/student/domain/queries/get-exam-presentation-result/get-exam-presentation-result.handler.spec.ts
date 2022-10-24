import { mock, MockProxy } from 'jest-mock-extended';

import { GetExamPresentationResultQueryHandler } from './get-exam-presentation-result.handler';

import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { ResponseEntity } from '@business/student/domain/entities/response.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';
import { ExamCopyNotFinishedError } from '@business/student/domain/errors/exam-copy-not-finished-error';
import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';

describe('Get exm presentation result', () => {
  let handler: GetExamPresentationResultQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;
  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;

  let training: Training;
  let examCopy: ExamCopy;

  const examId = 'examId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    examCopyQueryRepository = mock<ExamCopyQueryRepository>();

    handler = new GetExamPresentationResultQueryHandler(trainingQueryRepository, examCopyQueryRepository);

    training = {
      id: 'trainingId',
      category: TrainingCategoryEnum.PRESENTATION,
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: 'questionId',
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
    trainingQueryRepository.findPresentation.mockResolvedValue(training);

    examCopy = {
      id: 'examCopyId',
      examId: training.exams[0].id,
      state: ExamCopyStateEnum.COMPLETED,
      responses: [
        ResponseEntity.from({
          id: 'responseId',
          question: ExamQuestionEntity.from({
            id: 'questionId',
            examId,
            type: QuestionTypeEnum.WORD_LIST,
            question: 'el makla rahi el dekhel',
            answer: AnswerValueType.createWordListFromValue("la nourriture est à l'intérieur"),
            propositions: [],
          }),
          response: AnswerValueType.createWordListFromValue("la nourriture est à l'intérieur"),
        }),
      ],
    };
    examCopyQueryRepository.findExamCopy.mockResolvedValue(examCopy);
  });

  it('should throw if training presentation is not defined', async () => {
    trainingQueryRepository.findPresentation.mockResolvedValue(undefined);

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationNotFoundError());
  });

  it('should throw if the presentation exam is not finished', async () => {
    examCopy.state = ExamCopyStateEnum.IN_PROGRESS;
    examCopyQueryRepository.findExamCopy.mockResolvedValue(examCopy);

    await expect(handler.execute()).rejects.toStrictEqual(new ExamCopyNotFinishedError());
  });

  it('should the exam presentation result', async () => {
    const result = await handler.execute();

    expect(result).toStrictEqual({
      note: 1,
      total: 1,
    });
  });
});
