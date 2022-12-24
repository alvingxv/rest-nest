import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret:
    'TPBYlqRA3tW4reAqLQML1sZS72k36XF6S0pJQhNu7t6Icp3jrSGWISxz5E3tslm2Dt0BdU0o3yMRh1LVvNDMNaZ2ojddSOcd4DG5',
  signOptions: {
    expiresIn: 3600,
  },
};

export const refreshTokenConfig: JwtSignOptions = {
  expiresIn: 3600 * 24,
};
