import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { ProfessorFacades } from './professor-facade.providers';

@Module({
  imports: [CqrsModule],
  providers: [...ProfessorFacades],
  exports: [...ProfessorFacades],
})
export class ProfessorFacadeModule {}
