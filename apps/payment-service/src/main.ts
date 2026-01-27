import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  app.enableCors();
  await app.listen(process.env.PORT || 3004);
  console.log(`Payment Service is running on: http://localhost:${process.env.PORT || 3004}`);
}
bootstrap();