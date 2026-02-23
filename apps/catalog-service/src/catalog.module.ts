import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { MenuItem } from './entities/menu-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/catalog-service/.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = String(configService.get('DB_PASSWORD') || 'postgres');
        const username = String(configService.get('DB_USERNAME') || 'postgres');
        const host = String(configService.get('DB_HOST') || 'localhost');
        const port = parseInt(String(configService.get('DB_PORT') || '5434'), 10);
        const database = String(configService.get('DB_NAME') || 'catalog_db');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [Category, Restaurant, MenuItem],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Category, Restaurant, MenuItem]),
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}