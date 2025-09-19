import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration

  const config = new (DocumentBuilder as any)()
    .setTitle('Products API')
    .setDescription(
      'Public & Private modules for product management with Contentful integration',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = (SwaggerModule as any).createDocument(app, config);

  (SwaggerModule as any).setup('/api/docs', app, document);

  // Use ConfigService to get port from configuration
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 3000;

  await app.listen(port);
  console.log(`API running on http://localhost:${port}`);
  console.log(
    `Swagger documentation available at http://localhost:${port}/api/docs`,
  );
}

bootstrap().catch((error: unknown) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
