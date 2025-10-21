import { Module } from '@nestjs/common';
import { SupabaseClientService } from './supabase.client/supabase.client.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [SupabaseClientService],
  exports: [SupabaseClientService],
})
export class SupabaseModule {}
