import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Mengaktifkan ValidationPipe secara global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Menghilangkan properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Melempar error jika ada properti yang tidak diizinkan
      transform: true, // Mengubah payload menjadi instance DTO
    }),
  );

  const FRONTEND_URL = process.env.FRONTEND_URL;

  app.enableCors({
    origin: FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
