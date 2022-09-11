import { UuidGenerator } from './uuid-generator.interface';

export class IncrementalUuidGenerator implements UuidGenerator {
  constructor(private currentIncrement: string = '0') {}

  generate(): string {
    this.currentIncrement = (+this.currentIncrement + 1).toString();
    return this.currentIncrement;
  }
}
