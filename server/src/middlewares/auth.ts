import { NextFunction, Response } from "express";
import * as jwt from "./../lib/jwt";
import { ACCESS_SECRET, REFRESH_SECRET } from "./../config/secret";
import { getSession } from "./../database/user.sessions";
import { Secret } from "jsonwebtoken";
import { Session } from "./../types/session";

const verifyToken = async (token: string, secret: Secret) => {
  return await jwt.verify(token, secret);
};

const generateToken = async (session: Session) => {
  return await jwt.sign(
    { id: session.id, role: session.role, sessionId: session.sessionId },
    ACCESS_SECRET,
    { expiresIn: "2m" }
  );
};

export const checkAccessToken = async (req: any, res: Response, next: NextFunction) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return next();
  }

  try {
    req.user = await verifyToken(accessToken, ACCESS_SECRET);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      req.expiredAccessToken = true;
    } else {
      console.log(err);
    }

    next();
  }
}

export const checkRefreshToken = async (req: any, res: Response, next: NextFunction) => {
  if (!req.expiredAccessToken) return next();

  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next();
  }

  try {
    const refreshPayload = await verifyToken(refreshToken, REFRESH_SECRET);

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
    req.user = await verifyToken(newAccessToken, ACCESS_SECRET);

    next();
  } catch (err) {
    console.error(err.message, "- REFRESH TOKEN");
    next();
  }
}

export const isAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      data: {
        error: "You must login!",
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
        error: "You are unauthorized for this action - not a coach!",
      },
    });
  }

  next();
};