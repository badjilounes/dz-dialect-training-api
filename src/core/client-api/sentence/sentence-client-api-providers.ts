import { HttpService } from '@nestjs/axios';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SentenceControllerApi } from 'src/clients/sentence-api';

export const SentenceApiProviders: Provider[] = [
  {
    provide: SentenceControllerApi,
    inject: [ConfigService, HttpService],
    useFactory(config: ConfigService, http: HttpService) {
      const sentenceApiUrl = config.get('SENTENCE_API_URL');
      return new SentenceControllerApi(undefined, sentenceApiUrl, http.axiosRef);
    },
  },
];
