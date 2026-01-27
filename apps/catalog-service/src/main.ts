import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';

async function bootstrap() {
  const app = await NestFactory.create(CatalogModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3002);
  console.log(`Catalog Service is running on: http://localhost:${process.env.PORT || 3002}`);
}
bootstrap();