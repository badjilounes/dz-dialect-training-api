import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ContextModule } from './context/context.module';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule, DatabaseModule, ConfigModule.forRoot(), ContextModule],
  exports: [ConfigModule, ContextModule],
})
export class CoreModule {}
