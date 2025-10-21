import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AiIntegrationModule } from './modules/ai-integration/ai-integration.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule, AuthModule, TasksModule, AiIntegrationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
