import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, In, Repository } from 'typeorm';

import { QuestionTypeEnum } from '@business/training/domain/enums/question-type.enum';
import { TrainingCategoryEnum } from '@business/training/domain/enums/training-category.enum';
import { Training } from '@business/training/infrastructure/database/entities/training.entity';

@Injectable()
export class TrainingFixture {
  constructor(@InjectRepository(Training) private readonly repository: Repository<Training>) {}

  async createTraining(data: DeepPartial<Training> = {}): Promise<Training> {
    const training = this.repository.create({
      category: TrainingCategoryEnum.PRESENTATION,
      fromLanguage: 'fr',
      learningLanguage: 'dz',
      exams: [
        {
          name: 'name',
          order: 1,
          questions: [
            {
              type: QuestionTypeEnum.WORD_LIST,
              question: 'question',
              answer: ['answer'],
              propositions: ['proposition'],
              order: 1,
            },
          ],
        },
      ],
      ...data,
    });

    return this.repository.save(training);
  }

  findOneById(id: string): Promise<Training | null> {
    return this.repository.findOne({
      where: { id },
      order: { exams: { order: 'ASC', questions: { order: 'ASC' } } },
    });
  }

  async clearAll(options?: FindManyOptions<Training>): Promise<void> {
    const trainings = await this.repository.find(options);
    const trainingIdList = trainings.map((training) => training.id);

    if (trainingIdList.length) {
      await this.repository.delete({ id: In(trainingIdList) });
    }
  }
}
