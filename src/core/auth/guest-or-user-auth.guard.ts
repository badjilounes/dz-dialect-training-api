import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppContextService } from '@core/context/app-context.service';

@Injectable()
export class GuestOrUserAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly context: AppContextService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const guestId = request.headers['x-guest-id'];

    this.context.userId = user?.userId || guestId;

    if (err || (!user && !guestId)) {
      throw err || new UnauthorizedException();
    }

    return user || { userId: guestId };
  }
}
