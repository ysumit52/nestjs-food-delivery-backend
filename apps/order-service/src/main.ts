import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3003);
  console.log(`Order Service is running on: http://localhost:${process.env.PORT || 3003}`);
}
bootstrap();