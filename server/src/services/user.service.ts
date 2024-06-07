import { QueryParams } from "../query-builders/models/builder.models";
import { UserBuilder } from "../query-builders/user.builder";
import db from "../database/database-connector";
import * as jwt from "./../lib/jwt";
import SECRET from "./../config/secret";

const generateToken = async (createdUser: any) => {
  const payload = {
    id: createdUser.id,
    username: createdUser.username
  };

  const token = await jwt.sign(payload, SECRET, {});
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