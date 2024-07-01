import "dotenv/config";

const customConnection = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
}

import knex from "knex";

const knexConnect = knex({ client: "mysql2", connection: customConnection });

knexConnect.raw(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`)
    .then(() => {
        knexConnect.destroy();
        console.log("Successfully created database or exsisted.")
    })
    .catch((err) => {
        console.log(err)
    });