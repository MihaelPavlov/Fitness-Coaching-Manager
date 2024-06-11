import express from "express";

export const setAuthenticationCookies = (res: express.Response, accessToken: any, refreshToken: any) => {
    res.cookie("accessToken", accessToken, {
      maxAge: 2 * 60 * 100,
      httpOnly: true
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 10 * 60 * 100
    });
  }