export class DomainError extends Error {
  constructor() {
    super();
    this.name = this.constructor.name;
  }
}
