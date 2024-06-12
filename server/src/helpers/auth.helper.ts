import express from "express";
import * as bcrypt from "bcrypt";
import * as jwt from "../lib/jwt.lib";
import { Secret } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET_KEY } from "./../config/secret.config";
import { REFRESH_TOKEN_SECRET_KEY } from "./../config/secret.config";
import { createSession } from "./../services/user.sessions";

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

const generateAccessToken = async (
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

const generateRefreshToken = async (
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

export const createTokensAndSession = async (user: Record<string, any>) => {
  const session = createSession(user.id, user.user_role);

  const accessToken = await generateAccessToken(
    user,
    session.sessionId,
    ACCESS_TOKEN_SECRET_KEY,
    "2m"
  );
  const refreshToken = await generateRefreshToken(
    session.sessionId,
    REFRESH_TOKEN_SECRET_KEY,
    "10m"
  );
  return [accessToken, refreshToken, session];
}