import { Inject } from '@nestjs/common';

import { TrainingAggregate } from '../../../aggregates/training.aggregate';
import { TRAINING_COMMAND_REPOSITORY } from '../../../repositories/tokens';

import { CreateTrainingCommand, CreateTrainingCommandResult } from './create-training.command';

import { QuestionTypeEnum } from '@business/professor/domain/enums/question-type.enum';
import { TrainingCommandRepository } from '@business/professor/domain/repositories/training-command-repository';
import { CommandHandler, ICommandHandler } from '@cqrs/command';
import { EventPublisher } from '@cqrs/event';
import { UUID_GENERATOR } from '@ddd/domain/uuid/tokens';
import { UuidGenerator } from '@ddd/domain/uuid/uuid-generator.interface';

@CommandHandler(CreateTrainingCommand)
export class CreateTrainingHandler implements ICommandHandler<CreateTrainingCommand> {
  questionsType: QuestionTypeEnum = QuestionTypeEnum.WORD_LIST;

  constructor(
    @Inject(TRAINING_COMMAND_REPOSITORY)
    private readonly trainingCommandRepository: TrainingCommandRepository,

    @Inject(UUID_GENERATOR)
    private readonly uuidGenerator: UuidGenerator,

    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ payload }: CreateTrainingCommand): Promise<CreateTrainingCommandResult> {
    const trainingId = this.uuidGenerator.generate();

    const training = TrainingAggregate.create({
      id: trainingId,
      name: payload.name,
      description: payload.description,
      isPresentation: payload.isPresentation,
    });

    this.eventPublisher.mergeObjectContext(training);

    await this.trainingCommandRepository.persist(training);

    return {
      id: training.id,
      name: training.name,
      description: training.description,
      isPresentation: training.isPresentation,
    };
  }
}
