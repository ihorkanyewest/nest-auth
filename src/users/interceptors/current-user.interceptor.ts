import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.session || {};

    if (userId) {
      request.currentUser = await this.userService.findOne(userId);
    }

    return next.handle();
  }
}

export function Serialize(dto: any) {
  return UseInterceptors(new CurrentUserInterceptor(dto));
}