import { mock, MockProxy } from 'jest-mock-extended';

import { ShouldShowPresentationQueryHandler } from './should-show-presentation.handler';

import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { ResponseEntity } from '@business/student/domain/entities/response.entity';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/student/domain/enums/training-category.enum';
import { TrainingPresentationNotFoundError } from '@business/student/domain/errors/training-presentation-not-found-error';
import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { Training, TrainingQueryRepository } from '@business/student/domain/repositories/training-query-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { AppContextService } from '@core/context/app-context.service';

describe('Should show presentation', () => {
  let handler: ShouldShowPresentationQueryHandler;

  let trainingQueryRepository: MockProxy<TrainingQueryRepository>;
  let examCopyQueryRepository: MockProxy<ExamCopyQueryRepository>;
  let contextService: MockProxy<AppContextService>;

  let training: Training;
  let examCopy: ExamCopy;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  beforeEach(() => {
    trainingQueryRepository = mock<TrainingQueryRepository>();
    trainingQueryRepository.findPresentation.mockResolvedValue(undefined);

    examCopyQueryRepository = mock<ExamCopyQueryRepository>();
    examCopyQueryRepository.findExamCopy.mockResolvedValue(undefined);

    contextService = mock<AppContextService>();

    handler = new ShouldShowPresentationQueryHandler(trainingQueryRepository, examCopyQueryRepository, contextService);

    training = {
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      exams: [
        {
          id: examId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
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
  });

  it('should throw if no presentation exists', async () => {
    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationNotFoundError());
  });

  it('should be truthy if no exam copy exists for presentation', async () => {
    trainingQueryRepository.findPresentation.mockResolvedValue(training);

    const result = await handler.execute();

    expect(result).toBeTruthy();
  });

  it('should be falsy if an exam copy exists for presentation and if the copy is completed', async () => {
    trainingQueryRepository.findPresentation.mockResolvedValue(training);
    examCopyQueryRepository.findExamCopy.mockResolvedValue(examCopy);

    const result = await handler.execute();

    expect(result).toBe(false);
  });

  it('should be truthy if an exam copy exists for presentation but is still in progress', async () => {
    trainingQueryRepository.findPresentation.mockResolvedValue(training);

    examCopy.state = ExamCopyStateEnum.IN_PROGRESS;
    examCopyQueryRepository.findExamCopy.mockResolvedValue(examCopy);

    const result = await handler.execute();

    expect(result).toBe(true);
  });
});
