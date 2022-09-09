import { AsyncLocalStorage } from 'async_hooks';

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidGenerateV4 } from 'uuid';

export type ContextProps = {
  requestId: string;
  createdAt: number;
  url: string | undefined;
  userAgent: string | undefined;
  lang: string | undefined;
};

@Injectable()
export class ContextService<T extends ContextProps = ContextProps> {
  private readonly storage = new AsyncLocalStorage<T>();

  init(request: Request, next: () => unknown) {
    this.storage.run(
      {
        requestId: request.header('x-request-id') || uuidGenerateV4(),
        createdAt: Date.now(),
        url: request.originalUrl,
        userAgent: request.header('user-agent'),
      } as T,
      next,
    );
  }

  getProperty<K extends keyof T>(key: K): T[K] {
    return this.context[key];
  }

  setProperty<K extends keyof T>(key: K, value: T[K]) {
    this.context[key] = value;
  }

  get context() {
    const context = this.storage.getStore();
    if (!context) {
      throw new Error('The context must be initialized before calling ContextService.context');
    }
    return context;
  }

  get details() {
    const { url, userAgent } = this.context;
    return url ? `${userAgent} - ${url}` : 'app';
  }

  get lang() {
    return this.context.lang;
  }
}
