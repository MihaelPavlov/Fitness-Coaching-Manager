import { Knex } from "knex";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT,
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
