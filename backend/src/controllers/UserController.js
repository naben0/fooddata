import pool from '../config/databasePool.js'

class UserController {
    async createUser(req, res) {
        try {
          const { username, email, password } = req.body;
          const newUser = { username, email, password };
      
          const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`; // Use '?' for placeholders
      
          const [result] = await pool.promise().execute(query, [newUser.username, newUser.email, newUser.password]); // Use execute method
      
          res.sendStatus(201);
        } catch (err) {
          console.error('Failed to create user:', err);
          res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async getUserById(req, res) {
        try {
            const { userId } = req.params;

            const query = `SELECT username FROM users WHERE user_id = ?`; // Use '?' for placeholders

            const [result] = await pool.promise().execute(query, [userId]);

            if (result.length === 0) {
            res.status(404).json({ error: 'User not found' });
            } else {
            res.json(result[0]);
            }
        } catch (err) {
            console.error('Failed to retrieve user:', err);
            res.status(500).json({ error: 'Failed to retrieve user' });
        }
    }

    async updateUserById(req, res) {
        try {
            const { userId } = req.params;
            const { username, email, password } = req.body;

            const updatedUser = { username, email, password };
            let query = 'UPDATE users SET';

            const updateFields = [];
        
            if (updatedUser.username) {
              updateFields.push(' username = ?');
            }
        
            if (updatedUser.email) {
              updateFields.push(' email = ?');
            }
        
            if (updatedUser.password) {
              updateFields.push(' password = ?');
            }
        
            // Check if there are fields to update
            if (updateFields.length > 0) {
              query += updateFields.join(','); // Join the update fields
              query += ' WHERE user_id = ?'; // Add the WHERE clause
              const [result] = await pool.promise().execute(query, [...Object.values(updatedUser).filter(Boolean), userId]); // Filter out empty values
              res.sendStatus(200);
            } else {
                // No fields to update
                res.sendStatus(204);
            }
        } catch (err) {
            console.error('Failed to update user:', err);
            res.status(500).json({ error: 'Failed to update user' });
        }
    }

    async deleteUserById(req, res) {
        try {
            const { userId } = req.params;

            // Check for related records in has_meals
            const checkQuery = `SELECT COUNT(*) as count FROM has_meals WHERE user_id = ?`;
            const [checkResult] = await pool.execute(checkQuery, [validator.toInt(id)]);
            const relatedRecordsCount = checkResult[0].count;

            if (relatedRecordsCount > 0) {
            // Delete related records in has_meals
            const deleteRelatedQuery = `DELETE FROM has_meals WHERE user_id = ?`;
            const [result] = await pool.promise.execute(deleteRelatedQuery, [validator.toInt(id)]);
            }

            const query = `DELETE FROM users WHERE user_id = ?`; // Use '?' for placeholders

            const [result] = await pool.promise.execute(query, [userId]); // Use execute method

            res.sendStatus(200);
        } catch (err) {
            console.error('Failed to delete user:', err);
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
}
    
export default new UserController();