import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@app/common';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { LoginSchema, LoginDto } from './dto/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) dto: RegisterDto,
  ) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }
}