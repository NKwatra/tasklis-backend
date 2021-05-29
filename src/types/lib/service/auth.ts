export interface AuthService<Payload> {
  createToken: (payload: Payload) => Promise<string>;
  verifyToken: (token: string) => Promise<Payload>;
  createRefreshToken: (payload: Payload) => Promise<string>;
  verifyRefreshTokenAndCreateNew: (
    token: string
  ) => Promise<RefreshTokenVerifyResult<Payload>>;
}

export interface RefreshTokenVerifyResult<Payload> {
  valid: boolean;
  token: string | null;
  payload: Payload | null;
}
