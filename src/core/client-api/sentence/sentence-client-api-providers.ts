import { HttpService } from '@nestjs/axios';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SentenceApi } from '@sentence/api';

export const SentenceApiProviders: Provider[] = [
  {
    provide: SentenceApi,
    inject: [ConfigService, HttpService],
    useFactory(config: ConfigService, http: HttpService) {
      const sentenceApiUrl = config.get('SENTENCE_API_URL');
      return new SentenceApi(undefined, sentenceApiUrl, http.axiosRef);
    },
  },
];
