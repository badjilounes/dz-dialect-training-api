import { Repository } from 'typeorm';

import { BaseCommandRepository } from './base.command-repository';

import { AppContextService } from '@core/context/app-context.service';
import { AggregateRoot } from '@cqrs/aggregate';

export abstract class BaseTypeormCommandRepository<T extends AggregateRoot> extends BaseCommandRepository<
  T,
  Promise<any>
> {
  protected get userId() {
    return this.contextService.userId;
  }

  protected constructor(
    protected readonly repository: Repository<any>,
    protected readonly contextService: AppContextService,
  ) {
    super();
  }

  async transaction(promises: Promise<any>[]) {
    await this.repository.manager.transaction(() => Promise.all(promises));
  }
}
