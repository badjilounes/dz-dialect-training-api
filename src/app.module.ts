import { Module } from '@nestjs/common';

import { TrainingModule } from './business/training/application/training.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CoreModule, TrainingModule],
})
export class AppModule {}
