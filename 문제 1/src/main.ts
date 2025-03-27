import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(error => {
        if (error.constraints) {
          return Object.values(error.constraints);
        }
        return [];
      }).flat();
      return new BadRequestException(messages);
    }
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
