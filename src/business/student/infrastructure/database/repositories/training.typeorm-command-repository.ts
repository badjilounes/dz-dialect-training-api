import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrainingAggregate } from '../../../domain/aggregates/training.aggregate';
import { TrainingExamQuestion } from '../entities/training-exam-question.entity';

import { ExamAggregate } from '@business/student/domain/aggregates/exam.aggregate';
import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { TrainingCommandRepository } from '@business/student/domain/repositories/training-command-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { TrainingExam } from '@business/student/infrastructure/database/entities/training-exam.entity';
import { Training } from '@business/student/infrastructure/database/entities/training.entity';
import { examToExamAggregate } from '@business/student/infrastructure/mappers/exam.mapper';
import { trainingToTrainingAggregate } from '@business/student/infrastructure/mappers/training.mapper';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormCommandRepository } from '@ddd/infrastructure/base.typeorm-command-repository';

export class TrainingTypeormCommandRepository
  extends BaseTypeormCommandRepository<TrainingAggregate>
  implements TrainingCommandRepository
{
  constructor(
    @InjectRepository(Training)
    protected readonly repository: Repository<Training>,

    @InjectRepository(TrainingExam)
    protected readonly examRepository: Repository<TrainingExam>,

    @InjectRepository(TrainingExamQuestion)
    protected readonly examQuestionRepository: Repository<TrainingExamQuestion>,

    protected readonly context: AppContextService,
  ) {
    super(repository, context);
  }

  async findExamQuestions(examId: string): Promise<ExamQuestionEntity[]> {
    const examQuestions = await this.examQuestionRepository.find({
      where: { exam: { id: examId } },
      relations: ['exam'],
      order: { order: 'ASC' },
    });

    return examQuestions.map((examQuestion) =>
      ExamQuestionEntity.from({
        id: examQuestion.id,
        examId: examQuestion.exam.id,
        type: examQuestion.type,
        question: examQuestion.question,
        answer: AnswerValueType.from({ questionType: examQuestion.type, value: examQuestion.answer }),
        propositions: examQuestion.propositions,
        order: examQuestion.order,
      }),
    );
  }

  async findTrainingById(id: string): Promise<TrainingAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { id },
      order: {
        courses: {
          order: 'ASC',
          exams: {
            order: 'ASC',
            questions: { order: 'ASC' },
          },
        },
      },
    });

    if (!training) {
      return undefined;
    }

    return trainingToTrainingAggregate(training);
  }

  async findExamById(id: string): Promise<ExamAggregate | undefined> {
    const exam = await this.examRepository.findOne({
      where: { id },
      order: { questions: { order: 'ASC' } },
      relations: ['training'],
    });

    if (!exam) {
      return undefined;
    }

    return examToExamAggregate(exam);
  }

  async findTrainingPresentationExam(): Promise<ExamAggregate | undefined> {
    const training = await this.repository.findOne({
      where: { isPresentation: true },
      order: {
        courses: {
          order: 'ASC',
          exams: {
            order: 'ASC',
            questions: { order: 'ASC' },
          },
        },
      },
    });

    if (!training?.courses.length && !training?.courses[0].exams.length) {
      return undefined;
    }

    const [course] = training.courses;
    const [exam] = course.exams;

    return examToExamAggregate({ ...exam, course });
  }
}
