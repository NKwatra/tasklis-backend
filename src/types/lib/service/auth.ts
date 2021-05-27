export interface AuthService<Payload> {
  createToken: (payload: Payload) => Promise<string>;
  verifyToken: (token: string) => Promise<Payload>;
}
