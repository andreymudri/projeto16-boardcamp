import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

if (process.env.MODE === "prod") configDatabase.ssl = true;
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default db;
