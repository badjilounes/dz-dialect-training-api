import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';

import { ProfessorModule } from '@business/professor/application/professor.module';
import { StudentModule } from '@business/student/application/student.module';

@Module({
  imports: [CoreModule, StudentModule, ProfessorModule],
})
export class AppModule {}
