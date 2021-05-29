import type { Response } from "express";

export const setRefreshTokenCookie = (res: Response, refresh_token: string) => {
  res.cookie("X-Refresh-Token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "none",
  });
};
