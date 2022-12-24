import { User } from './../../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { RefreshToken } from '../entitiy/refresh-token.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RefreshRepository extends Repository<RefreshToken> {
  constructor(private dataSource: DataSource) {
    super(RefreshToken, dataSource.createEntityManager());
  }

  async createRefreshToken(user: User, ttl: number): Promise<RefreshToken> {
    const refreshToken = this.create();
    refreshToken.user = user;
    refreshToken.isRevoked = false;
    const expiredAt = new Date();
    expiredAt.setTime(expiredAt.getTime() + ttl);
    refreshToken.expiredAt = expiredAt;

    return await refreshToken.save();
  }
}
