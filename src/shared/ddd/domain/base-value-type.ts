import { validateSync, ValidationError } from 'class-validator';

import { DomainValidationError } from './error/domain-validation-error';

export type ValueTypeErrorFactory = new (errors: ValidationError[]) => any;

export abstract class ValueType {
  protected validate(errorCls?: ValueTypeErrorFactory): void {
    const errors = validateSync(this);
    if (errors.length) {
      if (errorCls) {
        throw new errorCls(errors);
      } else {
        throw new DomainValidationError(errors);
      }
    }
  }
}
