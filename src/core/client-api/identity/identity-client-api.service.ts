import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientApiService } from '../client-api.service';

@Injectable()
export class IdentityClientApiService extends ClientApiService {
  protected readonly logger = new Logger(IdentityClientApiService.name);

  constructor(private readonly httpService: HttpService, private readonly config: ConfigService) {
    super(httpService, config.get('IDENTITY_API_URL'));
  }

  async isConnected(token: string): Promise<boolean> {
    const connectedUser = await this.get<object | undefined>('getConnectUser', token, {}, undefined);
    return Boolean(connectedUser);
  }
}
