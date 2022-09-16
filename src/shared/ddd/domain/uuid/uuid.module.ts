import { Module } from '@nestjs/common';

import { RandomUuidGenerator } from './random-uuid.generator';
import { UUID_GENERATOR } from './tokens';

const UuidGenerators = [
  {
    provide: UUID_GENERATOR,
    useClass: RandomUuidGenerator,
  },
];

@Module({
  providers: [...UuidGenerators],
  exports: [...UuidGenerators],
})
export class UuidModule {}
