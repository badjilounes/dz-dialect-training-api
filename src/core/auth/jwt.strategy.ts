import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppContextService } from '../context/app-context.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly context: AppContextService, private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate<T extends { id: string }>(request: Request, payload: T) {
    this.context.userId = payload.id;

    if (request.headers.authorization) {
      this.context.token = request.headers.authorization.replace('Bearer ', '');
    }

    return { userId: this.context.userId };
  }
}
