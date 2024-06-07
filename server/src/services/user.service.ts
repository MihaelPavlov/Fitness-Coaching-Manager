import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import { Secret } from "jsonwebtoken";
import db from "../database/database-connector";
import * as jwt from "./../lib/jwt";
import { ACCESS_SECRET, REFRESH_SECRET } from "./../config/secret";

const generateAccessToken = async (user: any, sessionId: string, secret: Secret, expiresIn: string) => {
  const payload = {
      id: user.id,
      role: user.role,
      sessionId
  };

  const token = await jwt.sign(payload, secret, { expiresIn });
  return token;
}

const generateRefreshToken = async (sessionId: string, secret: Secret, expiresIn: string) => {
  const payload = {
      sessionId
  };

  const token = await jwt.sign(payload, secret, { expiresIn });
  return token;
}

export const getUsers = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);

  return await builder.buildQuery();
};

export const getUser = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);
  builder.entityById = payload.id;

  return await builder.buildQuery();
};

const createUser = async (data: any) => db("users").insert(data);

const createUserSpecs = async (data: any) => db("user_specs").insert(data);

export const registerUser = async (data: any) => {
  const user = await db("users").select("*").where('email', data.email);

  if (user) {
    throw new Error("User already exsist!");
  }

  
}