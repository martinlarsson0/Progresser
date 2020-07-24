import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  port: parseInt(process.env.DATABASE_PORT),
});

pool.on("error", (err) => {
  console.error("DB POOL: Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
