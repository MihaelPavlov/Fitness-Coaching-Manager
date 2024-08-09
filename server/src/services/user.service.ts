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
import { invalidateSession } from "./user.sessions";
import { invalidateAccessToken } from "./invalid-tokens";
import { UserWorkoutsBuilder } from "../query-builders/user-workouts.builder";
import { KnexValidationException } from "../models/exceptions/knex-validation.exception";

export const getUsers = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);

  return await builder.buildQuery();
};

export const getUser = async (payload: QueryParams) => {
  let builder = new UserBuilder(payload);
  builder.entityById = payload.id;

  return await builder.buildQuery();
};

export const registerUser = async (
  data: Record<string, any>,
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] }
) => {
  const user = await db(TABLE.USERS)
    .select("*")
    .where("email", "=", data.email)
    .orWhere("username", "=", data.username);

  if (user.length > 0)
    throw new KnexValidationException(EXCEPTION.USER_ALREADY_EXIST);

  try {
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
        languages: data.languages,
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

      const filenames: Array<string> = [];

      if (files && Array.isArray(files)) {
        files.forEach((file) => {
          filenames.push(file.filename);
        });
      }

      Array(data?.links.split(",")[0])
        .filter((el) => el !== "")
        .forEach((link) => filenames.push(link));

      filenames.forEach(async (filename) => {
        await db(TABLE.CONTRIBUTORS_APPLICATIONS).insert({
          contributor_id: createdContributorID,
          item_uri: filename,
        });
      });
    }

    return createTokensAndSession({
      id: createdUserID,
      user_role: data?.userRole || UserRoles.User,
      username: data?.username,
    });
  } catch (error) {
    throw new KnexValidationException("Email Or Username are invalid");
  }
};

export const loginUser = async (data: Record<string, any>) => {
  const user = (
    await db(TABLE.USERS).select("*").where("email", "=", data.email)
  ).at(0);

  if (!user) {
    throw new KnexValidationException(EXCEPTION.INVALID_LOGIN);
  }

  if (!(await verifyPassword(data.password, user.password))) {
    throw new KnexValidationException(EXCEPTION.INVALID_LOGIN);
  }

  return createTokensAndSession({
    id: user.id,
    user_role: user.user_role,
    username: user.username,
  });
};

export const logoutUser = (sessionId: string, token: string) => {
  invalidateSession(sessionId);
  invalidateAccessToken(token);
};

export const updateUser = async (
  userId: number,
  data: Record<string, any>,
  file?: Express.Multer.File
) => {
  const user = (
    await db(TABLE.USERS).select("*").where("email", "=", data?.email)
  ).at(0);

  if (user && user.id !== userId)
    throw new KnexValidationException(EXCEPTION.VALIDATION.EMAIL_NOT_UNIQUE);
  try {
    await db(TABLE.USERS)
      .where("id", "=", userId)
      .update({
        first_name: data?.firstName,
        last_name: data?.lastName,
        email: data?.email,
        profile_picture_url: file?.filename || data?.profilePicture,
      });

    await db(TABLE.USER_SPECS)
      .where("user_id", "=", userId)
      .update({
        weight: data?.weight || 0,
        weight_goal: data?.weightGoal || 0,
        date_of_birth: data?.birthDate == "null" || !data?.birthDate ? db.raw("DEFAULT") : new Date(data?.birthDate),
      });
  } catch (error) {
    throw new KnexValidationException(EXCEPTION.VALIDATION.UPDATE_FAILED);
  }
};

export const subscribeToContributor = async (
  userId: number,
  contributorId: number
) => {
  if (await isContributorSubscribing(userId)) {
    throw new KnexValidationException(
      "Contributors can't subscribe to other contributors"
    );
  }

  if (await hasUserSubscribed(userId, contributorId)) {
    throw new KnexValidationException(
      "You are already subscribed to this contributor"
    );
  }

  await db(TABLE.CONTRIBUTORS_SUBSCRIBERS).insert({
    contributor_id: contributorId,
    user_id: userId,
  });

  const contributorUser = (
    await db(TABLE.CONTRIBUTORS)
      .select("user_id")
      .where("id", "=", contributorId)
  ).at(0);

  const userChat = (
    await db(TABLE.CHATS)
      .select("*")
      .where("initiator_user_id", "=", contributorUser.user_id)
      .andWhere("recipient_user_id", "=", userId)
  ).at(0);

  if (userChat) {
    await db(TABLE.CHATS)
      .where("initiator_user_id", "=", contributorUser.user_id)
      .andWhere("recipient_user_id", "=", userId)
      .update({
        is_active: 1,
      });
  } else {
    await db(TABLE.CHATS).insert({
      initiator_user_id: contributorUser.user_id,
      recipient_user_id: userId,
    });
  }
};

export const unsubscribeToContributor = async (
  userId: number,
  contributorId: number
) => {
  if (await isContributorSubscribing(userId)) {
    throw new KnexValidationException(
      "Contributors can't unsubscribe to other contributors"
    );
  }

  if (!(await hasUserSubscribed(userId, contributorId))) {
    throw new KnexValidationException("You are not subscribed");
  }

  await db(TABLE.CONTRIBUTORS_SUBSCRIBERS)
    .where("contributor_id", "=", contributorId)
    .andWhere("user_id", "=", userId)
    .del();

  await db(TABLE.CHATS)
    .where("initiator_user_id", "=", contributorId)
    .andWhere("recipient_user_id", "=", userId)
    .update({
      is_active: 0,
    });
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

export const addWorkoutToUserWorkoutCollection = async (
  userId: number,
  workoutId: number
) => {
  await db(TABLE.USER_WORKOUT_COLLECTION).insert({
    user_id: userId,
    workout_session_id: workoutId,
  });
};

export const removeWorkoutToUserWorkoutCollection = async (
  userId: number,
  workoutId: number
) => {
  await db(TABLE.USER_WORKOUT_COLLECTION)
    .where("user_id", "=", userId)
    .andWhere("workout_session_id", "=", workoutId)
    .del();
};

export const getUserWorkoutCollection = async (payload: QueryParams, query?: string, tags?: string) => {
  let builder = new UserWorkoutsBuilder(payload);
  let workouts = await builder.buildQuery();

  return workouts;
};

const isContributorSubscribing = async (userId: number) => {
  return (
    (await db(TABLE.CONTRIBUTORS).select("*").where("user_id", "=", userId))
      .length > 0
  );
};
