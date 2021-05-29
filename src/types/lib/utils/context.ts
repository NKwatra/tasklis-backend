import type { Response } from "express";
import type { UserPayload } from "../../graphql/user";
export interface Context {
  user: UserPayload | null;
  res: Response;
  refresh_token: string | null;
}
