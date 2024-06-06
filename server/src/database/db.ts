import Knex from "knex";
import knexConfig from "../../knex.config";

// Create a Knex instance using the configuration for the current environment
const knex = Knex(knexConfig[process.env.NODE_ENV || "development"]);

// Helper function to format the SQL with bindings
function formatSQL(sql: string, bindings: any[]): string {
  return bindings.reduce((prev, curr) => prev.replace("?", `'${curr}'`), sql);
}

// For DEBUG
// Attach a query event listener to log generated SQL queries
knex.on("query", (queryData) => {
  const formattedSQL = formatSQL(queryData.sql, queryData.bindings);
  console.log("Generated SQL:", formattedSQL);
});
export default knex;
