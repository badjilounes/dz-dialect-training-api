import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, In, Repository } from 'typeorm';

import { TrainingFixture } from '../training/training.fixture';

import { ExamCopyStateEnum } from '@business/student/domain/enums/exam-copy-state.enum';
import { ExamCopyQuestionResponse } from '@business/student/infrastructure/database/entities/exam-copy-question-response.entity';
import { ExamCopy } from '@business/student/infrastructure/database/entities/exam-copy.entity';

@Injectable()
export class ExamCopyFixture {
  constructor(
    @InjectRepository(ExamCopy) private readonly repository: Repository<ExamCopy>,
    @InjectRepository(ExamCopyQuestionResponse) private readonly responseRepository: Repository<ExamCopyQuestionResponse>,
    private readonly trainingFixture: TrainingFixture,
  ) {}

  async createExamCopy(userId: string, data: DeepPartial<ExamCopy> = {}): Promise<ExamCopy> {
    const examCopy = this.repository.create({
      userId,
      exam: data.exam || (await this.trainingFixture.createTraining()).exams[0],
      ...data,
    });

    return this.repository.save(examCopy);
  }

  async completeCopy(examCopyId: string): Promise<void> {
    await this.repository.update(examCopyId, { state: ExamCopyStateEnum.COMPLETED });
  }

  findUserResponse(examId: string, questionId: string, userId: string): Promise<ExamCopyQuestionResponse | null> {
    return this.responseRepository.findOne({
      where: {
        examCopy: { exam: { id: examId }, userId },
        question: { id: questionId },
      },
    });
  }

  async clearAll(options?: FindManyOptions<ExamCopy>): Promise<void> {
    const copyList = await this.repository.find(options);
    const copyIdList = copyList.map((copy) => copy.id);

    if (copyIdList.length) {
      await this.repository.delete({ id: In(copyIdList) });
    }
  }
}
