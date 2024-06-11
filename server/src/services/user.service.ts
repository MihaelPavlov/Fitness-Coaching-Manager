import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import db from "../database/database-connector";
import { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } from "../config/secret.config";
import { createSession } from "./../database/user.sessions";
import { verifyPassword, generatePasswordHash, generateAccessToken, generateRefreshToken } from "./../helpers/auth.helper";
import EXCEPTIONS from "./../constants/exceptions.constants";

export const getUsers = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);

  return await builder.buildQuery();
};

export const getUser = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);
  builder.entityById = payload.id;

  return await builder.buildQuery();
};

export const registerUser = async (data: Record<string, any>) => {
  const user = await db("users").select("*").where("email", "=", data.email);

  if (user.length > 0) {
    throw new Error(EXCEPTIONS.USER_ALREADY_EXIST);
  }

  const newUser = await createUser({
    first_name: data?.first_name || null,
    last_name: data?.last_name || null,
    user_role: data?.user_role || -1,
    username: data.username,
    email: data.email,
    password: await generatePasswordHash(data.password),
    country: data.country,
    phone_number: data?.phone_number || null,
    languages: data.languages,
  });
  const newUserID: number = newUser[0];
  
  const createdUser = (
    await db("users").select("*").where("id", "=", newUserID)
  ).at(0);

  // Create user specs from created user
  await createUserSpecs({
    user_id: createdUser.id,
    sex: data.sex,
    fitness_level: data?.fitness_level || null,
  });

  // Coach user
  if (data.user_role == 1) {
    // Insert data into contributors and applications
    const createdContributorID = (
      await createContributor({
        user_id: createdUser.id,
      })
    ).at(0);

    await createContributorApplication({
      contributor_id: createdContributorID,
      item_uri: data.item_uri,
    });
  }

  const session = createSession(createdUser.id, createdUser.role);

  const accessToken = await generateAccessToken(
    createdUser,
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
};

export const loginUser = async (data: Record<string, any>) => {
  const user = (
    await db("users").select("*").where("email", "=", data.email)
  ).at(0);

  if (!user) {
    throw new Error(EXCEPTIONS.INVALID_LOGIN);
  }

  if (!(await verifyPassword(data.password, user.password))) {
    throw new Error(EXCEPTIONS.INVALID_LOGIN);
  }

  const session = createSession(user.id, user.role);

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
};

/******************/
// Helper functions
/******************/

const createUser = async (data: Record<string, any>): Promise<Array<number>> =>
  db("users").insert(data);

const createUserSpecs = async (data: Record<string, any>) =>
  db("user_specs").insert(data);

const createContributor = async (data: Record<string, any>) =>
  db("contributors").insert(data);

const createContributorApplication = async (data: Record<string, any>) =>
  db("contributor_applications").insert(data);
