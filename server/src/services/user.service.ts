import { UserBuilder } from "../builders/user.builder";
import db from "./../database/db";

export const getUsers = async (payload: any) => {
    let builder = new UserBuilder;
    if (payload.limit !== undefined) {
        builder.limit = payload.limit;
    }
    if (payload.offset !== undefined) {
        builder.offset = payload.offset;
    }
    if (payload.what !== undefined) {
        builder.fields = payload.what;
    }
    if (payload.condition !== undefined) {
        builder.condition = payload.condition;
    }

    return builder.executeQuery();
};

export const getUser = async (payload: any) => {
    let builder = new UserBuilder;
    if (payload.what !== undefined) {
        builder.fields = payload.what;
    }
    builder.id = payload.id;

    return builder.executeQuery();
};

export const createUser = async (data: any) => db("users").insert(data);

export const createUserSpecs = async (data: any) => db("user_specs").insert(data);