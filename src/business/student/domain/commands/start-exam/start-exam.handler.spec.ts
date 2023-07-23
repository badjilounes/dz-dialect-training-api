import { mock, MockProxy } from 'jest-mock-extended';

import { TrainingAggregate } from '../../aggregates/training.aggregate';

import { StartExamHandler } from './start-exam.handler';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamNotFoundError } from '@business/student/domain/errors/exam-not-found-error';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

describe('Start exam', () => {
  let handler: StartExamHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';

  let training: TrainingAggregate;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new StartExamHandler(examCopyCommandRepository, trainingCommandRepository, uuidGenerator, eventPublisher);

    training = TrainingAggregate.from({
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

    trainingCommandRepository.findExamById.mockResolvedValue(training.exams[0]);
  });

  it('should throw if no exam exist for given id', async () => {
    trainingCommandRepository.findExamById.mockResolvedValue(undefined);

    await expect(handler.execute({ payload: { examId } })).rejects.toStrictEqual(new ExamNotFoundError(examId));
  });

  it('should create a copy for given exam', async () => {
    await handler.execute({ payload: { examId } });

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.any(ExamCopyAggregate));
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(expect.objectContaining({ examId }));
  });
});
