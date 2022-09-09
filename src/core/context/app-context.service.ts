import { Injectable } from '@nestjs/common';

import { ContextProps, ContextService } from './context.service';

interface AppContextProps extends ContextProps {
  userId?: string;
  token?: string;
}

@Injectable()
export class AppContextService {
  constructor(private readonly context: ContextService<AppContextProps>) {}

  get userId(): string {
    const userId = this.context.getProperty('userId');
    if (!userId) {
      throw new Error('userId not found in context');
    }
    return userId;
  }

  set userId(userId: string) {
    this.context.setProperty('userId', userId);
  }

  get token(): string {
    const token = this.context.getProperty('token');
    if (!token) {
      throw new Error('Token not found in context');
    }
    return token;
  }

  set token(token: string) {
    this.context.setProperty('token', token);
  }
}
