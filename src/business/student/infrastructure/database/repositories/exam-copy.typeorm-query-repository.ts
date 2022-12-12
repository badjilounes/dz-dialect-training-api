import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExamQuestionEntity } from '@business/student/domain/entities/question.entity';
import { ResponseEntity } from '@business/student/domain/entities/response.entity';
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

  async findExamCopy(examId: string): Promise<ExamCopy | undefined> {
    const copy = await this.repository.findOne({
      where: { exam: { id: examId }, userId: this.context.userId },
      relations: ['exam', 'responses', 'responses.question'],
      order: {
        createdAt: 'DESC',
      },
    });

    if (!copy) {
      return undefined;
    }

    return {
      id: copy.id,
      examId: copy.exam.id,
      responses: copy.responses.map((response) =>
        ResponseEntity.from({
          id: response.id,
          question: ExamQuestionEntity.from({
            id: response.question.id,
            examId: copy.exam.id,
            type: response.question.type,
            question: response.question.question,
            answer: AnswerValueType.from({
              questionType: response.question.type,
              value: response.question.answer,
            }),
            propositions: response.question.propositions,
            order: response.question.order,
          }),
          response: AnswerValueType.from({
            questionType: response.question.type,
            value: response.response,
          }),
        }),
      ),
      state: copy.state,
    };
  }
}
