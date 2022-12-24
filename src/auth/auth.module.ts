import { JwtStrategy } from './jwt.strategy';
import { RefreshRepository } from './repository/refresh-token.repository';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { jwtConfig } from 'src/config/jwt.config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RefreshToken } from './entitiy/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule.register(jwtConfig),
    UsersModule,
  ],
  providers: [AuthService, RefreshRepository, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
