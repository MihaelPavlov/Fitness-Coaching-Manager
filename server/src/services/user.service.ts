import { QueryParams } from "../builders/types/types";
import { UserBuilder } from "../builders/user.builder";
import db from "./../database/db";

export const getUsers = async (payload: QueryParams) => {
    let builder = new UserBuilder(payload);

    return await builder.buildQuery();
};

export const getUser = async (payload: QueryParams) => {
    let builder = new UserBuilder(payload);
    builder.entityById = payload.id;

    return await builder.buildQuery();
};

export const createUser = async (data: any) => db("users").insert(data);

export const createUserSpecs = async (data: any) => db("user_specs").insert(data);