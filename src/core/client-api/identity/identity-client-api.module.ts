import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { IdentityApiProviders } from './identity-client-api-providers';
import { IdentityClientApiService } from './identity-client-api.SERVICE';

@Module({
  imports: [HttpModule],
  providers: [...IdentityApiProviders, IdentityClientApiService],
  exports: [IdentityClientApiService],
})
export class IdentityApiModule {}
