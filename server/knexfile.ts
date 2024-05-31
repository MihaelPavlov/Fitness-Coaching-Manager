// Update with your config settings.
import * as configs from "./src/config/db.config";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const config = {
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
    }
  },
};

export default config;