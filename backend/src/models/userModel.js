import pool from '../config/database.js';

export const createUser = async (user) => {
  const { username, email, password, weight, height, allergens } = user;

    // Check if the username already exists
    const usernameCheckQuery = `
    SELECT * FROM USERS WHERE username = ?
  `;
  
  const connection = await pool.promise().getConnection();  

  try {
    const [existingUsers] = await connection.query(usernameCheckQuery, [username]);

    if (existingUsers.length > 0) {
        // Username already exists, return an error
        return { success: false, message: 'Username already exists. Please choose a different username.' };
    }
    
     // Username is unique, proceed with user creation
     const createUserQuery = `
     INSERT INTO USERS (username, email, password) 
     VALUES (?, ?, ?)
   `;

   const [userResult] = await connection.query(createUserQuery, [username, email, password]);

   const userId = userResult.insertId;

    // Insert optional user data if provided
    if (weight) {
        // Insert new weight data
        const [weightResult] = await connection.query(
            `INSERT INTO WEIGHTS (value, date) VALUES (?, NOW())`,
            [weight]
        );

        const weightId = weightResult.insertId;

        // Insert into users_weight table
        await connection.query(
            `INSERT INTO users_weight (weight_id, user_id, weight_date) VALUES (?, ?, NOW())`,
            [weightId, userId]
        );
    }

    if (height) {
        const [heightResult] = await connection.query(
            `INSERT INTO HEIGHTS (value, date) VALUES (?, NOW())`,
            [height]
        );

        const heightId = heightResult.insertId;

        // Insert into users_weight table
        await connection.query(
            `INSERT INTO users_height (height_id, user_id, height_date) VALUES (?, ?, NOW())`,
            [heightId, userId]
        );
    }

    if (allergens && allergens.length > 0) {
        for (const allergen of allergens) {
          await connection.query(
            `INSERT INTO ALLERGENS (allergen_name, user_id) VALUES (?, ?)`,
            [allergen, userId]
          );
        }
    }

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Failed to create user' };
  } finally {
    connection.release();
  }
};

export const getUserById = async (userId) => {
  const query = `
    SELECT * FROM USERS WHERE user_id = ?
  `;

  const [rows] = await pool.promise().query(query, [userId]);

  return rows[0];
};

export const updateUser = async (userId, userData) => {
    const { username, email, password, weight, height, allergens } = userData;
  
    const connection = await pool.promise().getConnection();
  
    try {
      // Update user attributes
      if (username || email || password) {
        const updateQuery = `
          UPDATE USERS 
          SET 
            username = ?,
            email = ?,
            password = ?
          WHERE user_id = ?
        `;
        await connection.query(updateQuery, [
          username,
          email,
          password,
          userId,
        ]);
      }
  
        // Update user's height, weight, and allergens
        if (weight) {
            // Insert new weight data
            const [weightResult] = await connection.query(
                `INSERT INTO WEIGHTS (value, date) VALUES (?, NOW())`,
                [weight]
            );

            const weightId = weightResult.insertId;

            // Insert into users_weight table
            await connection.query(
                `INSERT INTO users_weight (weight_id, user_id, weight_date) VALUES (?, ?, NOW())`,
                [weightId, userId]
            );
        }
  
        if (height) {
            const [heightResult] = await connection.query(
                `INSERT INTO HEIGHTS (value, date) VALUES (?, NOW())`,
                [height]
            );

            const heightId = heightResult.insertId;

            // Insert into users_weight table
            await connection.query(
                `INSERT INTO users_height (height_id, user_id, height_date) VALUES (?, ?, NOW())`,
                [heightId, userId]
            );
        }
    
        if (allergens && allergens.length > 0) {
          for (const allergen of allergens) {
            await connection.query(
              `INSERT INTO ALLERGENS (allergen_name, user_id) VALUES (?, ?)`,
              [allergen, userId]
            );
          }
      }
  
      return { success: true, message: 'User updated successfully' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, message: 'Failed to update user' };
    } finally {
      connection.release();
    }
  };
  
  export const deleteUser = async (userId) => {
    const connection = await pool.promise().getConnection();
  
    try {
      // Delete user
      await connection.query(`DELETE FROM USERS WHERE user_id = ?`, [userId]);
  
      // You may also want to delete associated data like heights, weights, and allergens
      await connection.query(`DELETE FROM HEIGHTS WHERE user_id = ?`, [userId]);
      await connection.query(`DELETE FROM WEIGHTS WHERE user_id = ?`, [userId]);
      await connection.query(`DELETE FROM ALLERGENS WHERE user_id = ?`, [userId]);
  
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, message: 'Failed to delete user' };
    } finally {
      connection.release();
    }
  };
  
  // User data

  export const getUsernameById = async (userId) => {
    const query = `
      SELECT username FROM USERS WHERE user_id = ?
    `;
  
    const [rows] = await pool.promise().query(query, [userId]);
  
    return rows.length > 0 ? rows[0].username : null;
  };
  
  export const getHeightDataByUserId = async (userId) => {
    const query = `
      SELECT h.value AS height_value, h.date AS height_date
      FROM HEIGHTS h
      JOIN users_height uh ON h.height_id = uh.height_id
      WHERE uh.user_id = ?
    `;
  
    const [rows] = await pool.promise().query(query, [userId]);
  
    return rows;
  };

  export const getWeightDataByUserId = async (userId) => {
    const query = `
      SELECT w.value AS weight_value, w.date AS weight_date
      FROM WEIGHTS w
      JOIN users_weight uw ON w.weight_id = uw.weight_id
      WHERE uw.user_id = ?
    `;
  
    const [rows] = await pool.promise().query(query, [userId]);
  
    return rows;
  };

  export const getAllergenDataByUserId = async (userId) => {
    const query = `
    SELECT allergen_name
    FROM ALLERGENS
    WHERE user_id = ?
  `;
  
    const [rows] = await pool.promise().query(query, [userId]);
  
    return rows.map(row => row.allergen_name);
  };