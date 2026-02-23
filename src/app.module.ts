import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'apps/auth-service/src/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'apps/auth-service/src/auth.service';
import { DatabaseModule } from '@app/database/config/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule { }
