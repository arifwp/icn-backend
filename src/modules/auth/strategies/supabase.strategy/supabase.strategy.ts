// src/common/strategies/supabase.strategy.ts
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('supabase.jwtSecret');

    if (!secret) {
      throw new InternalServerErrorException(
        'SUPABASE_JWT_SECRET not configured.',
      );
    }

    super({
      jwtFromRequest: (req: Request) => {
        const tokenFromCookie = req.cookies?.access_token as string | null;
        if (tokenFromCookie) return tokenFromCookie;

        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(payload: CurrentUserPayload): CurrentUserPayload {
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid JWT Payload');
    }

    const userPayload: CurrentUserPayload = {
      sub: String(payload.sub),
      email: String(payload.email || ''),
      role: String(payload.role),
    };

    return userPayload;
  }
}
