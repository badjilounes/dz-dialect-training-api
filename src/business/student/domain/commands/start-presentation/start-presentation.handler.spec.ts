import { EventPublisher } from '@nestjs/cqrs';
import { mock, MockProxy } from 'jest-mock-extended';

import { UuidGenerator } from '../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { ExamCopyAggregate } from '../../aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';
import { TrainingPresentationExamNotFoundError } from '../../errors/training-presentation-exam-not-found-error';
import { ProfessorGateway, Training } from '../../gateways/professor-gateway';
import { ExamCopyCommandRepository } from '../../repositories/exam-copy-command-repository';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { StartPresentationHandler } from './start-presentation.handler';

describe('Start presentation', () => {
  let handler: StartPresentationHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let professorGateway: MockProxy<ProfessorGateway>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';
  const examCopyId = 'examCopyId';

  let trainingPresentation: Training;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    professorGateway = mock<ProfessorGateway>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new StartPresentationHandler(examCopyCommandRepository, professorGateway, uuidGenerator, eventPublisher);

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

  it('should start training presentation', async () => {
    uuidGenerator.generate.mockReturnValueOnce(examCopyId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);

    const result = await handler.execute();

    const [question] = trainingPresentation.courses[0].exams[0].questions;

    expect(result).toEqual({
      id: examCopyId,
      examId,
      state: ExamCopyStateEnum.IN_PROGRESS,
      questions: [
        {
          id: questionId,
          type: question.type,
          order: question.order,
          question: question.question,
          propositions: question.propositions,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ],
      currentQuestionIndex: 0,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(examCopyCommandRepository.persist).toHaveBeenCalledWith(
      expect.objectContaining(
        ExamCopyAggregate.from({
          id: examCopyId,
          examId,
          state: ExamCopyStateEnum.IN_PROGRESS,
          questions: [
            {
              id: questionId,
              examCopyId,
              examQuestionId: questionId,
              type: question.type,
              order: question.order,
              question: question.question,
              propositions: question.propositions,
              answer: AnswerValueType.from({
                questionType: question.type,
                value: question.answer,
              }),
              response: undefined,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
            },
          ],
          currentQuestionIndex: 0,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ),
    );
  });
});
