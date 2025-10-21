import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database/supabase';

@Injectable()
export class SupabaseClientService {
  public readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.key');

    if (!supabaseUrl || !supabaseKey) {
      throw new InternalServerErrorException(
        'Supabase URL or Key not found in configuration.',
      );
    }

    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }
}
