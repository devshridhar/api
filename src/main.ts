import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import basicAuthMiddleware from './middleware/basic-auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
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
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  /*
  // enable CORS when go for production
  app.enableCors({
    origin: ['https://trusted-domain.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization',
  });
  */

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
