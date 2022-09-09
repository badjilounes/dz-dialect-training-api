import { Injectable, Logger } from '@nestjs/common';

import { UsersApi } from 'src/clients/identity-api';

@Injectable()
export class IdentityClientApiService {
  protected readonly logger = new Logger(IdentityClientApiService.name);

  constructor(private readonly usersApi: UsersApi) {}

  async isConnected(token: string): Promise<boolean> {
    const connectedUser = await this.usersApi.getConnectedUser({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return Boolean(connectedUser);
  }
}
