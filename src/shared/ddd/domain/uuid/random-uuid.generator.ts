import { v4 as uuidGenerateV4 } from 'uuid';

import { UuidGenerator } from './uuid-generator.interface';

export class RandomUuidGenerator implements UuidGenerator {
  // eslint-disable-next-line class-methods-use-this
  generate(): string {
    return uuidGenerateV4();
  }
}
