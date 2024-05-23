import { createConnection } from "mysql2/promise";
import * as configs from "./config/db-config";

async function createDatabase() {
    const connection = await createConnection({
        host: configs.DB_HOST,
        port: 3306,
        user: configs.DB_USERNAME,
        password: configs.DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${configs.DB_NAME}\`;`);
    console.log(`Database ${configs.DB_NAME} created or already exsits`);
    await connection.end();
}

createDatabase().catch(err => {
    console.log(`Error on creating database: ${err}`);
});