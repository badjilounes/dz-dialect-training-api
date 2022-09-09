import { Module } from '@nestjs/common';

import { TrainingController } from './training.controller';
/*
https://docs.nestjs.com/modules
*/

@Module({
  imports: [],
  controllers: [TrainingController],
  providers: [],
})
export class TrainingModule {}
