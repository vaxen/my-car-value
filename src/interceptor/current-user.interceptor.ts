import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from '../auth/service/user.service';

//not used, replaced with current user middleware
//reason: req-> middleware ->guard -> interceptor -> request handler -> response
//so our admin guard could not read the currentUser from the session injected by this interceptor
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }
    console.log('user id: ' + userId);

    return handler.handle();
  }
}
