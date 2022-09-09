import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { SentenceApiProviders } from './sentence-client-api-providers';
import { SentenceClientApiService } from './sentence-client-api.service';

@Module({
  imports: [HttpModule],
  providers: [...SentenceApiProviders, SentenceClientApiService],
  exports: [SentenceClientApiService],
})
export class SentenceApiModule {}
