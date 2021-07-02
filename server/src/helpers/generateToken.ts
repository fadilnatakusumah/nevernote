import { Response } from "express";
import { sign } from "jsonwebtoken";
import { CONST } from "../constants/strings";
import { User } from "../entity/User";
export const generateAccessToken = (user: User) => {
  return sign(
    {
      userId: user.id,
    },
    CONST.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (user: User) => {
  return sign(
    {
      userId: user.id,
      tokenVersion: user.token_version
    },
    CONST.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie(CONST.JWT_COOKIE, refreshToken, {
    httpOnly: true,
  });
};
