import * as configs from "./config/db.config";

const customConnection = {
    host: configs.DB_HOST,
    user: configs.DB_USERNAME,
    password: configs.DB_PASSWORD
}

import knex from "knex";

const knexConnect = knex({ client: "mysql2", connection: customConnection });

knexConnect.raw(`CREATE DATABASE IF NOT EXISTS ${configs.DB_NAME}`)
    .then(() => {
        knexConnect.destroy();
        console.log("Successfully created database or exsisted.")
    })
    .catch((err) => {
        console.log(err)
    });