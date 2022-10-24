import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LoggerModule } from '../logger/logger.module';

import { DatabaseLogger } from './database.logger';

import { DatabaseOptionsModule } from '@core/database/database-options.module';
import { DatabaseOptionsService } from '@core/database/database-options.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, DatabaseOptionsModule],
      inject: [ConfigService, DatabaseOptionsService],
      useFactory: (configService: ConfigService, databaseUrl: DatabaseOptionsService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
        logger: new DatabaseLogger(configService),
        ssl: configService.get('DATABASE_SSL_STRICT') ? { rejectUnauthorized: false } : false,
        schema: databaseUrl.schema,
      }),
    }),
  ],
})
export class DatabaseModule {}
