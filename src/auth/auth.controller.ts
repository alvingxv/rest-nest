import { JwtGuard } from './../guard/jwt.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LoginResponse } from './interface/login-response.interface';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    return await this.authService.refreshAccessToken(refreshTokenDto);
  }

  @Patch('revoke/:id')
  @UseGuards(JwtGuard)
  async revokeRefresh(@Param('id') id: string): Promise<void> {
    return this.authService.revokeRefresh(id);
  }
}
