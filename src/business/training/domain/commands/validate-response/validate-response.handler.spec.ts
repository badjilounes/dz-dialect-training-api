import { mock, MockProxy } from 'jest-mock-extended';

import { ValidateResponseHandler } from './validate-response.handler';

import { EventPublisher } from '@cqrs/event';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';
import { TrainingAggregate, TrainingAggregateProps } from 'business/training/domain/aggregates/training.aggregate';
import { ExamEntity, ExamEntityProps } from 'business/training/domain/entities/exam.entity';
import { ExamQuestionEntity, QuestionEntityProps } from 'business/training/domain/entities/question.entity';
import { ExamTypeEnum } from 'business/training/domain/enums/exam-type.enum';
import { TrainingCategoryEnum } from 'business/training/domain/enums/training-category.enum';
import { ExamNotFoundError } from 'business/training/domain/errors/exam-not-found-error';
import { QuestionNotFoundError } from 'business/training/domain/errors/question-not-found-error';
import { TrainingNotFoundError } from 'business/training/domain/errors/training-not-found-error';
import { TrainingCommandRepository } from 'business/training/domain/repositories/training-command-repository';

describe('Validate user response', () => {
  let handler: ValidateResponseHandler;

  let trainingCommandRepository: MockProxy<TrainingCommandRepository>;
  let uuidGenerator: MockProxy<UuidGenerator>;
  let eventPublisher: MockProxy<EventPublisher>;

  let training: TrainingAggregate;
  let trainingExam: ExamEntity;
  let trainingExamQuestion: ExamQuestionEntity;

  let trainingProps: TrainingAggregateProps;
  let trainingExamProps: ExamEntityProps;
  let trainingExamQuestionProps: QuestionEntityProps;

  const trainingId = 'trainingId';
  const examId = 'examId';
  const questionId = 'questionId';
  const response = 'response';

  beforeEach(() => {
    trainingCommandRepository = mock<TrainingCommandRepository>();
    uuidGenerator = mock<UuidGenerator>();
    eventPublisher = mock<EventPublisher>();

    handler = new ValidateResponseHandler(trainingCommandRepository, uuidGenerator, eventPublisher);

    trainingExamQuestionProps = {
      id: questionId,
      examId,
      question: 'el makla rahi el dekhel',
      answer: "la nourriture est à l'intérieur",
      propositions: ['part', 'avec', 'nous', 'intérieur', 'quelque', 'est', 'est', "l'", 'nourriture', 'la', 'à'],
    };
    trainingExamProps = {
      id: examId,
      trainingId,
      name: 'presentation exam',
      type: ExamTypeEnum.TRANSLATION,
      questions: [trainingExamQuestionProps],
    };
    trainingProps = {
      id: trainingId,
      category: TrainingCategoryEnum.PRESENTATION,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [trainingExamProps],
    };
    training = TrainingAggregate.from(trainingProps);
    trainingExam = training.exams[0];
    trainingExamQuestion = trainingExam.questions[0];
  });

  it('should throw if training does not exist', async () => {
    await expect(
      handler.execute({
        trainingId,
        examId,
        questionId,
        response,
      }),
    ).rejects.toStrictEqual(new TrainingNotFoundError(trainingId));
  });

  it('should throw if exam does not exist in given training', async () => {
    trainingExamProps.id = 'otherExamId';
    trainingCommandRepository.findTrainingById.mockResolvedValue(TrainingAggregate.from(trainingProps));

    await expect(
      handler.execute({
        trainingId,
        examId,
        questionId,
        response,
      }),
    ).rejects.toStrictEqual(new ExamNotFoundError(examId));
  });

  it('should throw if question does not exist in given training exam', async () => {
    trainingExamQuestionProps.id = 'otherExamQuestionId';
    trainingCommandRepository.findTrainingById.mockResolvedValue(TrainingAggregate.from(trainingProps));

    await expect(
      handler.execute({
        trainingId,
        examId,
        questionId,
        response,
      }),
    ).rejects.toStrictEqual(new QuestionNotFoundError(questionId));
  });

  // it('should register user response for the given question', async () => {
  //   trainingExamQuestion.respond = jest.fn();

  //   await handler.execute({ trainingId, examId, questionId, response });

  //   expect(trainingExamQuestion.respond).toHaveBeenCalledWith(response);
  //   expect(trainingCommandRepository.persist).toHaveBeenCalledWith(training);
  // });
});
