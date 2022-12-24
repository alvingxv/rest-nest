import { RefreshRepository } from './repository/refresh-token.repository';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interface/login-response.interface';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private refreshRepository: RefreshRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(`Wrong email/password`);
    }
    const access_token = await this.createAccessToken(user);
    const refresh_token = await this.createRefreshToken(user);
    return { access_token, refresh_token } as LoginResponse;
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access_token: string }> {
    const { refresh_token } = refreshTokenDto;
    const payload = await this.decodeToken(refresh_token);
    const refreshToken = await this.refreshRepository.findOne({
      where: { id: payload.jid },
      relations: ['user'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('refresh token is not found');
    }

    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('refresh token is revoked');
    }

    const access_token = await this.createAccessToken(refreshToken.user);
    return { access_token };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token is expired');
      } else {
        throw new InternalServerErrorException('failed to decode token');
      }
    }
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
  async createRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.refreshRepository.createRefreshToken(
      user,
      +refreshTokenConfig.expiresIn,
    );
    const payload = {
      jid: refreshToken.id,
    };

    const refresh_token = await this.jwtService.signAsync(
      payload,
      refreshTokenConfig,
    );

    return refresh_token;
  }

  async revokeRefresh(id: string): Promise<void> {
    const refreshToken = await this.refreshRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });

    refreshToken.isRevoked = true;
    refreshToken.save();
  }
}
