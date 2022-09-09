import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AppContextService } from './app-context.service';
import { ContextMiddleware } from './context.middleware';
import { ContextService } from './context.service';

@Module({
  providers: [ContextService, AppContextService, ContextMiddleware],
  exports: [AppContextService],
})
export class ContextModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*');
  }
}
