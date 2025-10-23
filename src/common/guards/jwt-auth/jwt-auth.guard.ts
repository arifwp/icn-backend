import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('supabase-jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: unknown, user: TUser): TUser {
    if (err || !user) {
      const error =
        err instanceof Error ? err : new Error('Authentication failed');
      throw new UnauthorizedException(error.message);
    }
    return user;
  }
}
