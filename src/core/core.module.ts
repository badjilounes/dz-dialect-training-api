import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { JwtStrategy } from './auth/jwt.strategy';
import { ClientApiModule } from './client-api/client-api.module';
import { ContextModule } from './context/context.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule, DatabaseModule, ConfigModule.forRoot(), ContextModule, CqrsModule, ClientApiModule],
  providers: [JwtStrategy],
  exports: [ConfigModule, ContextModule, CqrsModule, ClientApiModule],
})
export class CoreModule {}
