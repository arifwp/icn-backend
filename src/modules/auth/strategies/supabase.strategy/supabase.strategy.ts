import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database/supabase';

interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
  aud?: string;
}

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  Strategy,
  'supabase-jwt',
) {
  private supabaseAdmin: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseJwtSecret = configService.get<string>('SUPABASE_JWT_SECRET');
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const serviceRoleKey = configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    if (!supabaseJwtSecret || !supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing required Supabase configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: supabaseJwtSecret,
      // Hapus atau sesuaikan issuer dan audience
      // issuer: supabaseUrl, // atau hapus jika menyebabkan masalah
      // audience: 'authenticated',
    });

    this.supabaseAdmin = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async validate(payload: JwtPayload): Promise<{
    sub: string;
    email: string;
    role: string;
  }> {
    try {
      // Gunakan admin.getUserById() dengan user ID dari payload
      const {
        data: { user },
        error,
      } = await this.supabaseAdmin.auth.admin.getUserById(payload.sub);

      if (error || !user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.email) {
        throw new UnauthorizedException('User email not found');
      }

      return {
        sub: user.id,
        email: user.email,
        role: payload.role || 'authenticated',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      throw new UnauthorizedException(errorMessage);
    }
  }
}
