import { AppContextService } from '@core/context/app-context.service';

export abstract class BaseTypeormQueryRepository {
  protected get userId() {
    return this.contextService.userId;
  }

  protected constructor(protected readonly contextService: AppContextService) {}
}
