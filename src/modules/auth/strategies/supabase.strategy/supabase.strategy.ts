import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Pastikan path ke service sudah benar. Saya asumsikan path sebelumnya benar,
// tapi jika ada error lagi, cek kembali path-nya.
import { SupabaseClientService } from 'src/providers/supabase/supabase.client/supabase.client.service';

// Interface untuk payload JWT dari Supabase
export interface SupabaseJwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  // ... claims lainnya
}

@Injectable()
// Masalah 1: Merapikan sintaksis
export class SupabaseStrategy extends PassportStrategy(
  Strategy,
  process.env.JWT_SECRET,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseClientService: SupabaseClientService,
  ) {
    // Masalah 2: Penanganan Tipe 'secretOrKey'
    const secret = configService.get<string>('supabase.jwtSecret');

    if (!secret) {
      // Pengecekan eksplisit untuk memastikan secret ada
      throw new InternalServerErrorException(
        'SUPABASE_JWT_SECRET not configured.',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // secret sekarang pasti bertipe string
    });
  }

  // Masalah 3: Menghapus 'async' karena tidak ada 'await' yang diperlukan.
  // Jika di masa depan Anda perlu memanggil DB, tambahkan kembali 'async'/'await'.
  validate(payload: SupabaseJwtPayload): SupabaseJwtPayload {
    // Di sini, JWT sudah diverifikasi (signature dan expiration) oleh passport-jwt.
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid JWT Payload');
    }

    // Payload akan di-attach ke req.user
    return payload;
  }
}
