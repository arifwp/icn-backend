import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { SupabaseAuthMiddleware } from 'src/common/middlewares/supabase-auth.middleware';

@Module({
  imports: [SupabaseModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SupabaseAuthMiddleware).forRoutes(TasksController);
  }
}
