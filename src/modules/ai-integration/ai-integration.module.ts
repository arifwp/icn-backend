import { Module } from '@nestjs/common';
import { AiIntegrationController } from './ai-integration/ai-integration.controller';
import { AiIntegrationService } from './ai-integration/ai-integration.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [ConfigModule],
  controllers: [AiIntegrationController],
  providers: [AiIntegrationService],
})
export class AiIntegrationModule {}
