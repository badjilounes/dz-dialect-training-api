import { EventPublisher } from '@nestjs/cqrs';
import { mock, MockProxy } from 'jest-mock-extended';

import { UuidGenerator } from '../../../../../shared/ddd/domain/uuid/uuid-generator.interface';
import { ExamCopyAggregate } from '../../aggregates/exam-copy.aggregate';
import { ExamCopyStateEnum } from '../../enums/exam-copy-state.enum';
import { QuestionTypeEnum } from '../../enums/question-type.enum';
import { TrainingExamNotFoundError } from '../../errors/training-exam-not-found-error';
import { Exam, ProfessorGateway } from '../../gateways/professor-gateway';
import { ExamCopyCommandRepository } from '../../repositories/exam-copy-command-repository';
import { AnswerValueType } from '../../value-types/answer.value-type';

import { StartExamCommandPayload } from './start-exam.command';
import { StartExamHandler } from './start-exam.handler';

describe('Start exam', () => {
  let handler: StartExamHandler;

  let examCopyCommandRepository: MockProxy<ExamCopyCommandRepository>;
  let professorGateway: MockProxy<ProfessorGateway>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  const trainingId = 'trainingId';
  const courseId = 'courseId';
  const examId = 'examId';

  let payload: StartExamCommandPayload;

  const questionId = 'questionId';
  const examCopyId = 'examCopyId';

  let exam: Exam;

  beforeEach(() => {
    examCopyCommandRepository = mock<ExamCopyCommandRepository>();
    professorGateway = mock<ProfessorGateway>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new StartExamHandler(examCopyCommandRepository, professorGateway, uuidGenerator, eventPublisher);

    payload = {
      trainingId,
      courseId,
      examId,
    };

    exam = {
      id: examId,
      courseId,
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
    };

    professorGateway.getExamById.mockResolvedValue(exam);
  });

  it('should throw if no exam exist for given identifiers', async () => {
    professorGateway.getExamById.mockResolvedValue(null);

    await expect(handler.execute({ payload })).rejects.toStrictEqual(
      new TrainingExamNotFoundError(trainingId, courseId, examId),
    );
  });

  it('should start exam', async () => {
    uuidGenerator.generate.mockReturnValueOnce(examCopyId);
    uuidGenerator.generate.mockReturnValueOnce(questionId);

    const result = await handler.execute({ payload });

    const [question] = exam.questions;

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
