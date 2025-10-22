import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { AiIntegrationService } from './ai-integration.service';

@Controller('ai-integration')
@UseGuards(JwtAuthGuard)
export class AiIntegrationController {
  constructor(private readonly aiService: AiIntegrationService) {}

  @Get()
  getTaskRecommendation() {
    return this.aiService.getTaskRecommendation();
  }
}
