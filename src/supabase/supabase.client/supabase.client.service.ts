import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'database/supabase';

@Injectable({ scope: Scope.REQUEST }) // Set scope ke REQUEST
export class SupabaseClientService {
  public client: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    // Initialize base client tanpa auth
    this.initializeClient();
  }

  private initializeClient(accessToken?: string) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.key');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    if (accessToken) {
      // Client dengan token dari frontend
      this.client = createClient<Database>(supabaseUrl, supabaseKey, {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        auth: {
          persistSession: false,
        },
      });
    } else {
      // Client tanpa auth (untuk operations yang tidak butuh RLS)
      this.client = createClient<Database>(supabaseUrl, supabaseKey);
    }
  }

  // Method untuk set token dari request
  setAccessToken(accessToken: string) {
    this.initializeClient(accessToken);
  }
}

// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { createClient, SupabaseClient } from '@supabase/supabase-js';
// import { Database } from 'database/supabase';

// @Injectable()
// export class SupabaseClientService {
//   public readonly client: SupabaseClient<Database>;

//   constructor(private readonly configService: ConfigService) {
//     const supabaseUrl = this.configService.get<string>('supabase.url');
//     const supabaseKey = this.configService.get<string>('supabase.key');

//     if (!supabaseUrl || !supabaseKey) {
//       throw new InternalServerErrorException(
//         'Supabase URL or Key not found in configuration.',
//       );
//     }

//     this.client = createClient<Database>(supabaseUrl, supabaseKey);
//   }
// }
