import express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "../lib/jwt.lib";
import { Secret } from "jsonwebtoken";

export const setAuthenticationCookies = (
  res: express.Response,
  accessToken: any,
  refreshToken: any
) => {
  res.cookie("accessToken", accessToken, {
    maxAge: 2 * 60 * 100,
    httpOnly: true,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 10 * 60 * 100,
  });
};

export const generatePasswordHash = async (password: string) => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = async (
  user: Record<string, any>,
  sessionId: string,
  secret: Secret,
  expiresIn: string
) => {
  const payload = {
    id: user.id,
    role: user.user_role,
    sessionId,
  };

  const token = await jwt.sign(payload, secret, { expiresIn });
  return token;
};

export const generateRefreshToken = async (
  sessionId: string,
  secret: Secret,
  expiresIn: string
) => {
  const payload = {
    sessionId,
  };

  const token = await jwt.sign(payload, secret, { expiresIn });
  return token;
};
