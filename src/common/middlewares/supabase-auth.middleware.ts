import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseClientService } from 'src/supabase/supabase.client/supabase.client.service';

@Injectable()
export class SupabaseAuthMiddleware implements NestMiddleware {
  constructor(private supabaseClientService: SupabaseClientService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      this.supabaseClientService.setAccessToken(token);
    }

    next();
  }
}
