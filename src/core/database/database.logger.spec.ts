import { ConfigService } from '@nestjs/config';

import { DatabaseLogger } from './database.logger';

describe('DatabaseLogger', () => {
  it('should be defined', () => {
    expect(new DatabaseLogger(new ConfigService({ TYPEORM_LOGGING: 'all' }))).toBeDefined();
  });
});
