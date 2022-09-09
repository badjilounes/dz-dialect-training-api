import { Module } from '@nestjs/common';

import { IdentityApiModule } from './identity/identity-client-api.module';
import { SentenceApiModule } from './sentence/sentence-client-api.module';

@Module({
  imports: [SentenceApiModule, IdentityApiModule],
  exports: [SentenceApiModule, IdentityApiModule],
})
export class ClientApiModule {}
