import jwt from "jsonwebtoken";
import type {
  AuthService,
  RefreshTokenVerifyResult,
} from "../../types/lib/service/auth";
import UserModel from "../../model/user";

export class Auth<Payload extends { id: string }>
  implements AuthService<Payload>
{
  createToken(payload: Payload) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.SECRET_KEY as string,
        { expiresIn: "15m" },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token as string);
        }
      );
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

  createRefreshToken(payload: Payload) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: "7d" },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token as string);
        }
      );
    });
  }

  verifyRefreshTokenAndCreateNew(token: string) {
    return new Promise<RefreshTokenVerifyResult<Payload>>((resolve) => {
      jwt.verify(
        token,
        process.env.REFRESH_TOKEN_KEY as string,
        (err, payload) => {
          if (err) {
            resolve({
              valid: false,
              token: null,
              payload: null,
            });
          } else {
            UserModel.findById((payload as Payload).id).then((user) => {
              if (user?.refresh_token !== token) {
                resolve({
                  valid: false,
                  token: null,
                  payload: null,
                });
              } else {
                // remove token specific properties from payload to create the new payload
                delete (
                  payload as { exp?: number; iat?: number; [key: string]: any }
                ).exp;
                delete (
                  payload as { exp?: number; iat?: number; [key: string]: any }
                ).iat;

                this.createRefreshToken(payload as Payload).then((token) =>
                  resolve({
                    valid: true,
                    token,
                    payload: payload as Payload,
                  })
                );
              }
            });
          }
        }
      );
    });
  }
}
