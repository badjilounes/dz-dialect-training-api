import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExamQuestionEntity } from '@business/training/domain/entities/question.entity';
import { ResponseEntity } from '@business/training/domain/entities/response.entity';
import { ExamCopy, ExamCopyQueryRepository } from '@business/training/domain/repositories/exam-copy-query-repository';
import { AnswerValueType } from '@business/training/domain/value-types/answer.value-type';
import { ExamCopy as ExamCopyEntity } from '@business/training/infrastructure/database/entities/exam-copy.entity';
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
      where: { exam: { id: examId } },
      relations: ['exam', 'responses'],
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
            examId: response.question.exam.id,
            type: response.question.type,
            question: response.question.question,
            answer: AnswerValueType.from({
              questionType: response.question.type,
              value: response.question.answer,
            }),
            propositions: response.question.propositions,
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
