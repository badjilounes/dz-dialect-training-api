import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ClientApiService } from '../client-api.service';

@Injectable()
export class SentenceClientApiService extends ClientApiService {
  protected readonly logger = new Logger(SentenceClientApiService.name);

  constructor(private readonly httpService: HttpService, private readonly config: ConfigService) {
    super(httpService, config.get('SENTENCE_API_URL'));
  }

  async getSentences(): Promise<string[]> {
    return [];
  }
}
