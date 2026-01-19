import mysql, { type PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const poolOptions: PoolOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  // password: process.env.DATABASE_PASSWORD || "rootpassword",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(poolOptions);

export default pool;
