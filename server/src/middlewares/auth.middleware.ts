import { NextFunction, Response } from "express";
import * as jwt from "./../lib/jwt";
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from "../config/secret.config";
import { getSession } from "./../database/user.sessions";
import { Secret } from "jsonwebtoken";
import { Session } from "../models/session.model";
import EXCEPTIONS from "./../constants/exceptions.constants";

const verifyToken = async (token: string, secret: Secret) => {
  return await jwt.verify(token, secret);
};

const generateToken = async (session: Session) => {
  return await jwt.sign(
    { id: session.id, role: session.role, sessionId: session.sessionId },
    ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "2m" }
  );
};

export const checkAccessToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  try {
    req.user = await verifyToken(accessToken, ACCESS_TOKEN_SECRET_KEY);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      req.expiredAccessToken = true;
    } else {
      console.log(err);
    }

    next();
  }
};

export const checkRefreshToken = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.expiredAccessToken) return next();

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next();
  }

  try {
    const refreshPayload = await verifyToken(refreshToken, REFRESH_TOKEN_SECRET_KEY);

    // @ts-ignore
    const session = getSession(refreshPayload.sessionId);
    if (!session) {
      return next();
    }

    const newAccessToken = await generateToken(session);

    res.cookie("accessToken", newAccessToken, {
      maxAge: 2 * 60 * 100,
      httpOnly: true,
    });

    // @ts-ignore
    req.user = await verifyToken(newAccessToken, ACCESS_TOKEN_SECRET_KEY);

    next();
  } catch (err) {
    console.error(err.message, "- REFRESH TOKEN");
    next();
  }
};

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      data: {
        error: EXCEPTIONS.UNAUTHENTICATED,
      },
    });
  }

  next();
};

export const isCoach = (req: any, res: Response, next: NextFunction) => {
  if (req.user.role !== 1) {
    return res.status(401).json({
      status: "fail",
      data: {
        error: EXCEPTIONS.UNAUTHORIZED,
      },
    });
  }

  next();
};
