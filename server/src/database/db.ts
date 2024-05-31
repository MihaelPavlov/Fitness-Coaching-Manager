import Knex from "knex";
import knexFile from "./../../knexfile";

const environment = "development";

const knex = Knex(knexFile[environment]);

function formatSQL(sql: string, bindings: any[]): string {
  return bindings.reduce((prev, curr) => prev.replace("?", `'${curr}'`), sql);
}

// Attach a query event listener to log generated SQL queries
knex.on("query", (queryData) => {
  const formattedSQL = formatSQL(queryData.sql, queryData.bindings);
  console.log("Generated SQL:", formattedSQL);
});

export default knex;