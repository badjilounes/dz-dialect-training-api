import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtStrategy } from './auth/jwt.strategy';
import { ClientApiModule } from './client-api/client-api.module';
import { ContextModule } from './context/context.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

import { GuestOrUserAuthGuard } from '@core/auth/guest-or-user-auth.guard';
import { JwtAuthGuard } from '@core/auth/jwt.guard';
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
  providers: [JwtStrategy, JwtAuthGuard, GuestOrUserAuthGuard],
  exports: [ConfigModule, ContextModule, CqrsModule, ClientApiModule, UuidModule],
})
export class CoreModule {}
