import { HttpService } from '@nestjs/axios';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersApi } from '@identity/api';

export const IdentityApiProviders: Provider[] = [
  {
    provide: UsersApi,
    inject: [ConfigService, HttpService],
    useFactory(config: ConfigService, http: HttpService) {
      const identityApiUrl = config.get('IDENTITY_API_URL');
      return new UsersApi(undefined, identityApiUrl, http.axiosRef);
    },
  },
];
