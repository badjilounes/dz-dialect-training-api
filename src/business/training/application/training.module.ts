import { Module } from '@nestjs/common';

import { TrainingQueryHandlers } from '../domain/queries';

import { TrainingController } from './training.controller';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [],
  controllers: [TrainingController],
  providers: [...TrainingQueryHandlers],
})
export class TrainingModule {}
