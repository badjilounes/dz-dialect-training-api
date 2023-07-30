import { mock, MockProxy } from 'jest-mock-extended';

import { ExamCopyNotFoundError } from '../../errors/exam-copy-not-found-error';
import { ExamCopyNotStartedError } from '../../errors/exam-copy-not-started-error';
import { TrainingPresentationExamNotFoundError } from '../../errors/training-presentation-exam-not-found-error';
import { ExamCopySkippedEvent } from '../../events/exam-copy-skipped-event';
import { ProfessorGateway, Training } from '../../gateways/professor-gateway';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { SkipPrensentationHandler } from './skip-presentation.handler';

import { ExamCopyAggregate } from '@business/student/domain/aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '@business/student/domain/enums/question-type.enum';
import { ExamCopyCommandRepository } from '@business/student/domain/repositories/exam-copy-command-repository';
import { EventPublisher } from '@cqrs/event';

describe('Skip presentation', () => {
  let handler: SkipPrensentationHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let professorGateway: MockProxy<ProfessorGateway>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';
  const examCopyId = 'examCopyId';

  let trainingPresentation: Training;
  let examCopy: ExamCopyAggregate;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    professorGateway = mock<ProfessorGateway>();
    eventPublisher = mock<EventPublisher>();

    handler = new SkipPrensentationHandler(examCopyCommandRepository, professorGateway, eventPublisher);

    trainingPresentation = {
      id: trainingId,
      name: 'trainingName',
      description: 'trainingDescription',
      isPresentation: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      courses: [
        {
          id: 'courseId',
          trainingId,
          name: 'courseName',
          description: 'courseDescription',
          order: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          exams: [
            {
              id: examId,
              courseId: 'courseId',
              name: 'examName',
              description: 'examDescription',
              order: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
              questions: [
                {
                  id: questionId,
                  examId,
                  type: QuestionTypeEnum.MULTIPLE_CHOICE,
                  order: 1,
                  question: 'question',
                  answer: ['answer1'],
                  propositions: ['proposition1'],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              ],
            },
          ],
        },
      ],
    };

    professorGateway.getTrainingPresentation.mockResolvedValue(trainingPresentation);

    examCopy = ExamCopyAggregate.from({
      id: examCopyId,
      examId,
      state: ExamCopyStateEnum.IN_PROGRESS,
      currentQuestionIndex: 0,
      questions: [
        {
          id: questionId,
          examCopyId,
          examQuestionId: questionId,
          type: QuestionTypeEnum.MULTIPLE_CHOICE,
          order: 1,
          question: 'question',
          propositions: ['proposition1'],
          answer: AnswerValueType.from({ questionType: QuestionTypeEnum.MULTIPLE_CHOICE, value: ['answer1'] }),
          response: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(examCopy);
  });

  it('should throw if no training presentation is defined', async () => {
    professorGateway.getTrainingPresentation.mockResolvedValue(null);

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationExamNotFoundError());
  });

  it('should throw if training presentation does not have any course', async () => {
    professorGateway.getTrainingPresentation.mockResolvedValue({ ...trainingPresentation, courses: [] });

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationExamNotFoundError());
  });

  it('should throw if training presentation course does not have any exam', async () => {
    professorGateway.getTrainingPresentation.mockResolvedValue({
      ...trainingPresentation,
      courses: [{ ...trainingPresentation.courses[0], exams: [] }],
    });

    await expect(handler.execute()).rejects.toStrictEqual(new TrainingPresentationExamNotFoundError());
  });

  it('should throw if no copy exists of training presentation for given user', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(undefined);

    await expect(handler.execute()).rejects.toStrictEqual(new ExamCopyNotFoundError(examId));
  });

  it('should throw if the copy of training presentation for given user is not in progress', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(
      ExamCopyAggregate.from({
        id: examCopyId,
        examId,
        state: ExamCopyStateEnum.COMPLETED,
        currentQuestionIndex: 0,
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(handler.execute()).rejects.toStrictEqual(new ExamCopyNotStartedError(examId));
  });

  it('should skip given copy', async () => {
    examCopyCommandRepository.findExamCopyByExamId.mockResolvedValue(examCopy);

    await handler.execute();

    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(examCopy);
    expect(examCopy.getUncommittedEvents()).toEqual(expect.arrayContaining([expect.any(ExamCopySkippedEvent)]));
  });
});
