import { Injectable, NestMiddleware } from '@nestjs/common';
import { UserService } from 'src/auth/service/user.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: any, res: any, next: () => void) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);
      req.currentUser = user;
    }
    console.log('user id: ' + userId);
    next();
  }
}
