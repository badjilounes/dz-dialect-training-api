import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from './auth/jwt.strategy';
import { ClientApiModule } from './client-api/client-api.module';
import { ContextModule } from './context/context.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

import { CqrsModule } from '@cqrs/module';
import { UuidModule } from '@ddd/domain/uuid/uuid.module';

@Global()
@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule.forRoot(),
    ContextModule,
    CqrsModule,
    ClientApiModule,
    UuidModule,
  ],
  providers: [JwtStrategy],
  exports: [ConfigModule, ContextModule, CqrsModule, ClientApiModule, UuidModule],
})
export class CoreModule {}
