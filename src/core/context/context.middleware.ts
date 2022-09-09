import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ContextService } from './context.service';

@Injectable()
export class ContextMiddleware implements NestMiddleware<Request, Response> {
  private readonly logger = new Logger(ContextMiddleware.name);

  constructor(private readonly contextService: ContextService) {}

  use(request: Request, _res: Response, next: NextFunction): void {
    this.contextService.init(request, () => {
      this.logger.verbose(`Context created - ${this.contextService.details}`);
      next();
    });
  }
}
