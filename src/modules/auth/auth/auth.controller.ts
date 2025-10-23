import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { LoginDto } from '../dto/login/login.dto';
import { RegisterDto } from '../dto/register/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const response = await this.authService.register(registerDto);

    return {
      user: response.data.user,
      token: response.data.session?.access_token || null,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const response = await this.authService.login(loginDto);
    const token = response.data.session?.access_token;

    return {
      user: response.data.user,
      token: token || null,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    await this.authService.logout();

    return { message: 'Logout berhasil' };
  }
}
