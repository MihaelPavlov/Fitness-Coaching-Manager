import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import db from "../database/database-connector";
import {
  verifyPassword,
  generatePasswordHash,
  createTokensAndSession,
} from "./../helpers/auth.helper";
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

  const createdUserID = (
    await db("users").insert({
      first_name: data?.first_name || null,
      last_name: data?.last_name || null,
      user_role: data?.user_role || -1,
      username: data.username,
      email: data.email,
      password: await generatePasswordHash(data.password),
      country: data.country,
      phone_number: data?.phone_number || null,
      languages: data.languages,
    })
  ).at(0);

  // Create user specs from created user
  await db("user_specs").insert({
    user_id: createdUserID,
    sex: data.sex,
    fitness_level: data?.fitness_level || null,
  });

  // Coach user
  if (data.user_role == 1) {
    // Insert data into contributors and applications
    const createdContributorID = (
      await db("contributors").insert({
        user_id: createdUserID,
      })
    ).at(0);

    await db("contributor_applications").insert({
      contributor_id: createdContributorID,
      item_uri: data.item_uri,
    });
  }

  return createTokensAndSession({ id: createdUserID, role: data?.user_role || -1 });
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

  return createTokensAndSession(user);
};

