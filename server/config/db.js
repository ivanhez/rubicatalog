import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "rrhhcrud-ivanhez96-rrhhcrud.i.aivencloud.com",
  user: process.env.DB_USER || "avnadmin",
  password: process.env.DB_PASS || "AVNS_tEvl4UmMs5WB52bNHmM",
  port: 27870,
  database: process.env.DB_NAME || "ecommerce",
  ssl: {
    rejectUnauthorized: false,
  },
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});
