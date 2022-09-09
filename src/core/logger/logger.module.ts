import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import { LoggerModuleOptionsFactory } from './logger-module-options.factory';

const factoryImports = [ConfigModule];
@Global()
@Module({
  imports: [
    ...factoryImports,
    WinstonModule.forRootAsync({
      imports: factoryImports,
      inject: [ConfigService],
      useClass: LoggerModuleOptionsFactory,
    }),
  ],
  providers: [LoggerModuleOptionsFactory],
})
export class LoggerModule {}
