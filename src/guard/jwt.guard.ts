import { AuthGuard } from '@nestjs/passport/dist';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}
