import { Injectable, Logger } from '@nestjs/common';

import { SentenceControllerApi, SentenceDTO } from '@sentence/api';

@Injectable()
export class SentenceClientApiService {
  protected readonly logger = new Logger(SentenceClientApiService.name);

  constructor(private readonly sentenceApi: SentenceControllerApi) {}

  async getSentences(count: number): Promise<Array<SentenceDTO>> {
    const response = await this.sentenceApi.generateRandomSentence(count);

    return response.data;
  }
}
