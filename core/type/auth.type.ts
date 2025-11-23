import type { Role } from './user.type';

export type SignIn = {
  username: string;
  password: string;
};

export type RefreshToken = {
  refreshToken: string;
};

export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type UserTokenPayload = {
  sub: number;
  role: Role;
};
