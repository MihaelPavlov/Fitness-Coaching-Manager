import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import db from "../database/database-connector";
import {
  verifyPassword,
  generatePasswordHash,
  createTokensAndSession,
} from "./../helpers/auth.helper";
import { TABLE } from "../database/constants/tables.constant";
import { EXCEPTION } from "../constants/exceptions.constants";
import { UserRoles } from "./../models/enums/user-roles.enum";
import { FitnessLevels } from "./../models/enums/fitness-levels.enum";

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
  const user = await db(TABLE.USERS)
    .select("*")
    .where("email", "=", data.email);

  if (user.length > 0) {
    throw new Error(EXCEPTION.USER_ALREADY_EXIST);
  }

  const createdUserID = (
    await db(TABLE.USERS).insert({
      first_name: data?.firstName || null,
      last_name: data?.lastName || null,
      user_role: data?.userRole || UserRoles.User,
      username: data.username,
      email: data.email,
      password: await generatePasswordHash(data.password),
      country: data.country,
      phone_number: data?.phoneNumber || null,
      language: data.language,
      profile_picture_url:
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    })
  ).at(0);

  // Create user specs from created user
  await db(TABLE.USER_SPECS).insert({
    user_id: createdUserID,
    sex: data.sex,
    fitness_level:
      data.userRole === UserRoles.Coach
        ? FitnessLevels.Elite
        : data?.fitnessLevel || null,
  });

  // Coach user
  if (data.userRole === UserRoles.Coach) {
    // Insert data into contributors and applications
    const createdContributorID = (
      await db(TABLE.CONTRIBUTORS).insert({
        user_id: createdUserID,
      })
    ).at(0);

    /* await db(TABLE.CONTRIBUTORS_APPLICATIONS).insert({
      contributor_id: createdContributorID,
      item_uri: data.item_uri,
    });  */
  }

  return createTokensAndSession({
    id: createdUserID,
    user_role: data?.userRole || UserRoles.User,
    username: data?.username,
  });
};

export const loginUser = async (data: Record<string, any>) => {
  const user = (
    await db(TABLE.USERS).select("*").where("email", "=", data.email)
  ).at(0);

  if (!user) {
    throw new Error(EXCEPTION.INVALID_LOGIN);
  }

  if (!(await verifyPassword(data.password, user.password))) {
    throw new Error(EXCEPTION.INVALID_LOGIN);
  }

  return createTokensAndSession({
    id: user.id,
    user_role: user.user_role,
    username: user.username,
  });
};

export const updateUser = async (userId: number, data: Record<string, any>) => {
  await db(TABLE.USERS).where("id", "=", userId).update({
    first_name: data?.firstName,
    last_name: data?.lastName,
    email: data?.email
  });
  
  await db(TABLE.USER_SPECS).where("user_id", "=", userId).update({
    weight: data?.weight,
    weight_goal: data?.weightGoal,
    date_of_birth: new Date(data?.birthDate)
  });
};

export const subscribeToContributor = async (
  userId: number,
  contributorId: number
) => {
  if (await isContributorSubscribing(userId)) {
    throw new Error("Contributors can't subscribe to other contributors");
  }

  if (await hasUserSubscribed(userId, contributorId)) {
    throw new Error("You are already subscribed to this contributor");
  }

  await db(TABLE.CONTRIBUTORS_SUBSCRIBERS).insert({
    contributor_id: contributorId,
    user_id: userId,
  });
};

export const unsubscribeToContributor = async (
  userId: number,
  contributorId: number
) => {
  if (await isContributorSubscribing(userId)) {
    throw new Error("Contributors can't unsubscribe to other contributors");
  }

  if (!(await hasUserSubscribed(userId, contributorId))) {
    throw new Error("You are not subscribed");
  }

  await db(TABLE.CONTRIBUTORS_SUBSCRIBERS)
    .where("contributor_id", "=", contributorId)
    .andWhere("user_id", "=", userId)
    .del();
};

export const hasUserSubscribed = async (
  userId: number,
  contributorId: number
) => {
  const hasSubscribed =
    (
      await db(TABLE.CONTRIBUTORS_SUBSCRIBERS)
        .select("*")
        .where("contributor_id", "=", contributorId)
        .andWhere("user_id", "=", userId)
    ).length > 0;

  return hasSubscribed;
};

const isContributorSubscribing = async (userId: number) => {
  return (
    await db(TABLE.CONTRIBUTORS)
        .select("*")
        .where("user_id", "=", userId)
  ).length > 0;
}