import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../aggregates/training.aggregate';

import { SkipExamHandler } from './skip-exam.handler';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamCopyNotStartedError } from '@business/student/domain/errors/exam-copy-not-started-error';
import { TrainingNotFoundError } from '@business/student/domain/errors/training-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Skip presentation', () => {
  let handler: SkipExamHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';
  const examCopyId = 'examCopyId';

  let trainingPresentation: TrainingAggregate;
  let examCopy: ExamCopyAggregate;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new SkipExamHandler(examCopyCommandRepository, trainingCommandRepository, uuidGenerator, eventPublisher);

    trainingPresentation = TrainingAggregate.from({
      id: trainingId,
      chapterId: 'chapterId',
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        {
          id: examId,
          courseId: trainingId,
          name: 'presentation exam',
          questions: [
            {
              id: questionId,
              type: QuestionTypeEnum.WORD_LIST,
              order: 1,
              question: 'el makla rahi el dekhel',
              examId,
              answer: AnswerValueType.createWordList({ value: ["la nourriture est à l'intérieur"] }),
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
    });

    trainingCommandRepository.findTrainingById.mockResolvedValue(trainingPresentation);

    examCopy = ExamCopyAggregate.from({
      id: examCopyId,
      examId,
      responses: [],
      state: ExamCopyStateEnum.IN_PROGRESS,
    });
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(examCopy);
  });

  it('should throw if no training exist for given id', async () => {
    trainingCommandRepository.findTrainingById.mockResolvedValue(undefined);

    await expect(handler.execute({ id: examId })).rejects.toStrictEqual(new TrainingNotFoundError(examId));
  });

  it('should throw if given copy is not in progress', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(undefined);

    await expect(handler.execute({ id: examId })).rejects.toStrictEqual(new ExamCopyNotStartedError());
  });

  it('should skip given copy', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(examCopy);

    await handler.execute({ id: examId });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(
      expect.objectContaining({ state: ExamCopyStateEnum.SKIPPED }),
    );
  });
});
