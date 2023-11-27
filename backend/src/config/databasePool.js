import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Your database configuration
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// Create a connection pool
const pool = mysql.createPool(config);

// Export the pool for use in other modules
export default pool;