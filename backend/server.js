import express from 'express';
import mysql from 'mysql2';
import usersRoutes from './src/routes/usersRoutes.js';
import userDataRoutes from './src/routes/userDataRoutes.js';
import mealsRoutes from './src/routes/mealsRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Create a connection pool with promise support
const pool = mysql.createPool({ ...config, Promise: mysql.Promise });

// Connect to the database using async/await
async function connectToDatabase() {
  try {
    const connection = await pool.promise().getConnection();
    console.log('Connected to the database');
    return connection;
  } catch (err) {
    console.error('Failed to connect to the database:', err);
    throw err;
  }
}
  
// Routes
app.use('/users', usersRoutes);
app.use('/data', userDataRoutes);
app.use('/meals', mealsRoutes);

// Start the server
const port = 4000;
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start the server:', err);
  });
