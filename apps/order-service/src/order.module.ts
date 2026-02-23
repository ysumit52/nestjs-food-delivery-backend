import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/order-service/.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = String(configService.get('DB_PASSWORD') || 'postgres');
        const username = String(configService.get('DB_USERNAME') || 'postgres');
        const host = String(configService.get('DB_HOST') || 'localhost');
        const port = parseInt(String(configService.get('DB_PORT') || '5435'), 10);
        const database = String(configService.get('DB_NAME') || 'order_db');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [Order, OrderItem],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}