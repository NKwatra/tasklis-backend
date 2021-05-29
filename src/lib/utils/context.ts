import type { Request, Response } from "express";
import type { UserPayload } from "../../types/graphql/user";
import type { Context } from "../../types/lib/utils/context";
import { Auth } from "../service/auth";

export const contextMiddleware = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  const auth = new Auth<UserPayload>();
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  const refresh_token: string | null =
    req.cookies && req.cookies["X-Refresh-Token"];
  if (!token) {
    return {
      user: null,
      res,
      refresh_token: refresh_token || null,
    };
  }
  const payload = await auth.verifyToken(token);
  return {
    user: payload,
    res,
    refresh_token: refresh_token || null,
  };
};
