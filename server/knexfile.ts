import { Knex } from "knex";
import * as configs from "./src/config/db.config";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: configs.DB_HOST,
      user: configs.DB_USERNAME,
      password: configs.DB_PASSWORD,
      database: configs.DB_NAME,
      port: configs.DB_PORT,
    },
    migrations: {
      directory: "./src/database/migrations",
    },
    seeds: {
      directory: './seeds'
    },
    debug: true // Enable debugging
  },
  production: {
    client: 'mysql',
    connection: {
      host: 'your_production_database_host',
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'your_database_name'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};

export default knexConfig;
