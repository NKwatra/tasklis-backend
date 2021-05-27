import jwt from "jsonwebtoken";
import type { AuthService } from "../../types/lib/service/auth";

export class Auth<Payload extends Object> implements AuthService<Payload> {
  createToken(payload: Payload) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, process.env.SECRET_KEY as string, {}, (err, token) => {
        if (err) {
          return reject(err);
        }
        resolve(token as string);
      });
    });
  }
  verifyToken(token: string) {
    return new Promise<Payload>((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY as string, (err, payload) => {
        if (err) {
          return reject(err);
        }
        resolve(payload as Payload);
      });
    });
  }
}
