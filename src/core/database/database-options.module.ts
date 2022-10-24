import { Module } from '@nestjs/common';

import { DatabaseOptionsService } from '@core/database/database-options.service';

@Module({
  providers: [DatabaseOptionsService],
  exports: [DatabaseOptionsService],
})
export class DatabaseOptionsModule {
  static forRoot(options: { schema: string }) {
    return {
      module: DatabaseOptionsModule,
      providers: [
        {
          provide: DatabaseOptionsService,
          useValue: new DatabaseOptionsService(options.schema),
        },
      ],
    };
  }
}
