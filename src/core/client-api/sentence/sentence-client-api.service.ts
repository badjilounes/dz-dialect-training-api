import { Injectable, Logger } from '@nestjs/common';

import { SentenceApi, SentenceResponseDto } from '@sentence/api';

@Injectable()
export class SentenceClientApiService {
  protected readonly logger = new Logger(SentenceClientApiService.name);

  constructor(private readonly sentenceApi: SentenceApi) {}

  async getSentences(count: number): Promise<SentenceResponseDto[]> {
    const response = await this.sentenceApi.getSentenceList(count);

    return response.data;
  }
}
