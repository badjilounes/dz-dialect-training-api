import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppContextService } from '../context/app-context.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly context: AppContextService) {
    super({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() });
  }

  validate<T extends { id: string }>(payload: T, request: Request) {
    const { id } = payload;

    this.context.token = request.headers.authorization?.replace('Bearer ', '');
    this.context.userId = id;

    return { userId: id };
  }
}
