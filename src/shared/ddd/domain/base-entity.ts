import { validateSync } from 'class-validator';

import { DomainValidationError } from './error/domain-validation-error';

export abstract class BaseEntity {
  protected validate(): void {
    const errors = validateSync(this);
    if (errors.length) {
      throw new DomainValidationError(errors);
    }
  }
}
