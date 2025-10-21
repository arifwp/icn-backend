import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SupabaseModule } from 'src/providers/supabase/supabase.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { SupabaseStrategy } from './strategies/supabase.strategy/supabase.strategy';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [PassportModule, SupabaseModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, SupabaseStrategy],
  exports: [AuthService, SupabaseStrategy],
})
export class AuthModule {}
