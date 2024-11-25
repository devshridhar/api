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
  app.use('/api-docs-json', basicAuthMiddleware);
  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description for the backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger JSON at '/api-docs-json'
  app.getHttpAdapter().get('/api-docs-json', (req, res) => {
    res.json(document);
  });

  // enable CORS when go for production
  app.enableCors({
    origin: '*', // Allows requests from all origins
    methods: '*', // Allows all HTTP methods
    credentials: true, // Allow sending credentials (cookies, authorization headers)
    allowedHeaders: '*', // Allows all headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
