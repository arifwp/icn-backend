import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { TaskRecommendationDto } from '../dto/task-recommendation.dto/task-recommendation.dto';

@Injectable()
export class AiIntegrationService {
  private readonly openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('openai.apiKey');
    if (!apiKey) {
      throw new InternalServerErrorException('OpenAI API Key not configured.');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async getTaskRecommendation(prompt: string): Promise<TaskRecommendationDto> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Bisa diganti ke gpt-4
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah Task Recommender AI. Berikan 3 rekomendasi task berdasarkan input user. Format respons harus JSON. Contoh format: [{ "title": "...", "description": "...", "status": "Todo" }]',
          },
          { role: 'user', content: prompt },
        ],
        // Minta response dalam format JSON
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      // Konten response
      const jsonString = completion.choices[0].message.content || '';
      // Parsing JSON dan validasi
      const recommendations = JSON.parse(jsonString) as TaskRecommendationDto[];
      return recommendations;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new InternalServerErrorException(
        'Gagal mendapatkan rekomendasi dari AI.',
      );
    }
  }
}
