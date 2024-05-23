import { Sequelize } from "sequelize";
import * as configs from "./../config/db-config";

const sequelizeConnection: Sequelize = new Sequelize(configs.DB_NAME, configs.DB_USERNAME, configs.DB_PASSWORD, {
    host: configs.DB_HOST,
    port: 3306,
    dialect: "mysql"
});

export default sequelizeConnection;