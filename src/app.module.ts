import { Module } from '@nestjs/common';

import { TrainingModule } from './business/training/application/training.module';

@Module({
  imports: [TrainingModule],
})
export class AppModule {}
