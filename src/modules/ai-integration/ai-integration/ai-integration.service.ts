import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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

  // Type guard: pastikan objek punya properti 'code' bertipe string
  private isOpenAIError(error: unknown): error is { code?: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as Record<string, unknown>)['code'] === 'string'
    );
  }

  async getTaskRecommendation(): Promise<any> {
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah Task Recommender AI. Berikan 3 rekomendasi task berdasarkan input user. Format respons harus JSON. Contoh format: [{ "title": "...", "description": "...", "startDate": "2025-10-23T09:00:00.000Z", "endDate": "2025-10-24T17:00:00.000Z", "status": "todo" }]. Value status berupa enum diantaranya adalah: todo, in_progress, dan done. Value dari endDate tidak boleh kurang dari atau sama dengan startDate',
          },
          {
            role: 'user',
            content: 'Saya ingin rekomendasi task untuk developer frontend',
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      const jsonString = completion.choices?.[0]?.message?.content ?? '';
      const recommendations = JSON.parse(jsonString) as any[];
      return recommendations;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        typeof (error as Record<string, unknown>).code === 'string' &&
        (error as { code: string }).code === 'insufficient_quota'
      ) {
        throw new InternalServerErrorException('Kuota OpenAI udah habis');
      }

      console.error('OpenAI API Error:', error);
      throw new InternalServerErrorException(
        'Gagal mendapatkan rekomendasi dari AI.',
      );
    }
  }
}
