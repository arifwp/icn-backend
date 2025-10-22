import { Module } from '@nestjs/common';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [SupabaseModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
