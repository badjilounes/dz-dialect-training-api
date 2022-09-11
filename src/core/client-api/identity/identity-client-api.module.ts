import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { IdentityApiProviders } from './identity-client-api-providers';

import { IdentityClientApiService } from '@core/client-api/identity/identity-client-api.service';

@Module({
  imports: [HttpModule],
  providers: [...IdentityApiProviders, IdentityClientApiService],
  exports: [IdentityClientApiService],
})
export class IdentityApiModule {}
