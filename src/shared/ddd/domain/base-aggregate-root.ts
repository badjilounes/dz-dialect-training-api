import { validateSync } from 'class-validator';

import { DomainValidationError } from './error/domain-validation-error';

import { AggregateRoot } from '@cqrs/aggregate';

export abstract class BaseAggregateRoot extends AggregateRoot {
  protected constructor() {
    super();
  }

  protected validate(): void {
    const errors = validateSync(this);
    if (errors.length) {
      throw new DomainValidationError(errors);
    }
  }
}
