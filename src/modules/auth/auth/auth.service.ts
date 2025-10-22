import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from '@supabase/supabase-js';
import { SupabaseClientService } from 'src/supabase/supabase.client/supabase.client.service';
import { LoginDto } from '../dto/login/login.dto';
import { RegisterDto } from '../dto/register/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { email, password, name } = registerDto;

    const emailRedirectTo = `${process.env.FRONTEND_URL}/email-verification`;
    const { data, error } = await this.supabaseClientService.client.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo,
        },
      },
    );

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.user) {
      return { data: { user: null, session: null }, error: null };
    }

    return { data, error: null };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    const { data, error } =
      await this.supabaseClientService.client.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    if (!data.session || !data.user) {
      throw new UnauthorizedException('Pastikan akun anda sudah terverifikasi');
    }

    return { data, error: null };
  }

  async logout(): Promise<void> {
    const { error } = await this.supabaseClientService.client.auth.signOut();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
