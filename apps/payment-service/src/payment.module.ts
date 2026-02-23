import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/payment-service/.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = String(configService.get('DB_PASSWORD') || 'postgres');
        const username = String(configService.get('DB_USERNAME') || 'postgres');
        const host = String(configService.get('DB_HOST') || 'localhost');
        const port = parseInt(String(configService.get('DB_PORT') || '5436'), 10);
        const database = String(configService.get('DB_NAME') || 'payment_db');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [Payment],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}