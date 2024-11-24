import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuthMiddleware from './middleware/basic-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.use('/api', basicAuthMiddleware);
  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('The Auth API documentation')
    .setVersion('1.0')
    .addTag('auth') // Add any tags you are using
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
