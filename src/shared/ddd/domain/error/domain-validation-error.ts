import { ValidationError } from 'class-validator';

import { DomainError } from './domain-error';

export class DomainValidationError extends DomainError {
  public readonly errors: string[];
  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors.map((error) => error.toString());
  }
}
