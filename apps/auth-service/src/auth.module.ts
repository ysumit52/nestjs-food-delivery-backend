import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/auth-service/.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const password = String(configService.get('DB_PASSWORD') || 'postgres');
        const username = String(configService.get('DB_USERNAME') || 'postgres');
        const host = String(configService.get('DB_HOST') || 'localhost');
        const port = parseInt(String(configService.get('DB_PORT') || '5433'), 10);
        const database = String(configService.get('DB_NAME') || 'auth_db');
        
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          entities: [User],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}