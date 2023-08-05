import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ExamCopyStateEnum } from '../../../domain/enums/exam-copy-state.enum';

import { ExamCopy, ExamCopyQueryRepository } from '@business/student/domain/repositories/exam-copy-query-repository';
import { AnswerValueType } from '@business/student/domain/value-types/answer.value-type';
import { ExamCopy as ExamCopyEntity } from '@business/student/infrastructure/database/entities/exam-copy.entity';
import { AppContextService } from '@core/context/app-context.service';
import { BaseTypeormQueryRepository } from '@ddd/infrastructure/base.typeorm-query-repository';

export class ExamCopyTypeormQueryRepository extends BaseTypeormQueryRepository implements ExamCopyQueryRepository {
  constructor(
    private readonly context: AppContextService,
    @InjectRepository(ExamCopyEntity)
    protected readonly repository: Repository<ExamCopyEntity>,
  ) {
    super(context);
  }
  async getLatestExamCopyInProgress(sortedExamList: string[]): Promise<ExamCopy | undefined> {
    const copyList = await this.repository.find({
      where: { examId: In(sortedExamList), userId: this.context.userId, state: ExamCopyStateEnum.IN_PROGRESS },
    });

    const [latestCopy] = copyList.sort((a, b) => sortedExamList.indexOf(b.examId) - sortedExamList.indexOf(a.examId));

    return latestCopy && this.buidlExamCopyFromEntity(latestCopy);
  }

  async getLatestExamCopyCompleted(sortedExamList: string[]): Promise<ExamCopy | undefined> {
    const copyList = await this.repository.find({
      where: { examId: In(sortedExamList), userId: this.context.userId, state: ExamCopyStateEnum.COMPLETED },
    });

    const [latestCopy] = copyList.sort((a, b) => sortedExamList.indexOf(b.examId) - sortedExamList.indexOf(a.examId));

    return latestCopy && this.buidlExamCopyFromEntity(latestCopy);
  }

  async findExamCopyByExamId(examId: string): Promise<ExamCopy | undefined> {
    const examCopy = await this.repository.findOne({
      where: { examId, userId: this.context.userId },
      order: {
        updatedAt: 'DESC',
        questions: { order: 'ASC' },
      },
    });

    if (!examCopy) {
      return undefined;
    }

    return this.buidlExamCopyFromEntity(examCopy);
  }

  async findExamCopyList(): Promise<ExamCopy[]> {
    const examCopyList = await this.repository.find({
      where: { userId: this.context.userId },
    });

    return examCopyList.map(this.buidlExamCopyFromEntity);
  }

  private buidlExamCopyFromEntity(examCopy: ExamCopyEntity): ExamCopy {
    return {
      id: examCopy.id,
      examId: examCopy.examId,
      state: examCopy.state,
      currentQuestionIndex: examCopy.currentQuestionIndex,
      createdAt: examCopy.createdAt,
      updatedAt: examCopy.updatedAt,
      questions: examCopy.questions.map((question) => ({
        id: question.id,
        type: question.type,
        order: question.order,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
        question: question.question,
        propositions: question.propositions,
        answer: AnswerValueType.from({ questionType: question.type, value: question.answer }).formattedValue,
        response: question.response
          ? {
              id: question.response.id,
              createdAt: question.response.createdAt,
              valid: question.response.valid,
              value: AnswerValueType.from({ questionType: question.type, value: question.response.response })
                .formattedValue,
            }
          : undefined,
      })),
    };
  }
}
