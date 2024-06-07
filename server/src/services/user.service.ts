import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import { Secret } from "jsonwebtoken";
import db from "../database/database-connector";
import * as jwt from "./../lib/jwt";
import { ACCESS_SECRET, REFRESH_SECRET } from "./../config/secret";
import { createSession } from "./../database/user.sessions";

const generateAccessToken = async (user: any, sessionId: string, secret: Secret, expiresIn: string) => {
  const payload = {
      id: user.id,
      role: user.user_role,
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

const createUser = async (data: Record<string, any>): Promise<Array<number>> => db("users").insert(data, ['username']);

const createUserSpecs = async (data: Record<string, any>) => db("user_specs").insert(data);

const createContributor = async (data: Record<string, any>) => db("contributors").insert(data);

const createContributorApplication = async (data: Record<string, any>) => db("contributor_applications").insert(data);

export const registerUser = async (data: Record<string, any>) => {
  const user = await db("users").select("*").where('email', "=", data.email);
  
  if (user.length > 0) {
    throw new Error("User already exsist!");
  }

  // Create new user
  const createdUserID = await createUser({
    user_role: data?.user_role || -1,
    username: data.username,
    email: data.email,
    password: data.password,
    country: data.country,
    languages: data.languages
  });
  const createdUser = (await db("users").select("*").where("id", "=", createdUserID[0])).at(0);
  
  // Create user specs from created user
  await createUserSpecs({
    user_id: createdUser.id,
    sex: data.sex,
    fitness_level: data.fitness_level
  });

  // Coach user
  if (data.user_role == 1) {
    // Insert data into contributors and applications
  }

  const session = createSession(createdUser.id, createdUser.role);

  const accessToken = await generateAccessToken(createdUser, session.sessionId, ACCESS_SECRET, "2m");
  const refreshToken = await generateRefreshToken(session.sessionId, REFRESH_SECRET, "10m");
  return [accessToken, refreshToken, session];
}