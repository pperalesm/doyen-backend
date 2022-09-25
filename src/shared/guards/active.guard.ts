import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_ACTIVE_KEY } from '../decorators/active.decorator';

@Injectable()
export class ActiveGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isActive = this.reflector.getAllAndOverride<boolean>(IS_ACTIVE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isActive) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return request.user.isActive;
  }
}
