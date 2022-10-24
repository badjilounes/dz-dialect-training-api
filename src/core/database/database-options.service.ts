import { Inject, Injectable, Optional } from '@nestjs/common';

export const DATABASE_SCHEMA_NAME = 'DATABASE_SCHEMA_NAME';

@Injectable()
export class DatabaseOptionsService {
  schema = this.schemaName;

  constructor(@Inject(DATABASE_SCHEMA_NAME) @Optional() private readonly schemaName = 'public') {}
}
