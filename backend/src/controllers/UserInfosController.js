import pool from '../config/databasePool.js'

class UserInfosController {
    async addUserInfosById(req, res) {
        try {
          const { userId } = req.params;
          const { height, weight/*, allergens*/ } = req.body;
          const infos = { height, weight/*, allergens*/ };

          let heightId, weightId;
          // TODO add allergens
      
          if (infos.height) {
            const date = Date.now();
            const heightQuery = `INSERT INTO height (size, date) VALUES (?, ?)`; // Use '?' for placeholders
            const [heightResult] = await pool.promise().execute(heightQuery, [height, date])
            
            // Retrieve the auto-generated height_id
            heightId = heightResult.insertId;

            // Now you can use heightId to insert into the is_tall table
            if (heightId) {
            const isTallQuery = `INSERT INTO is_tall (height_id, height_date, user_id) VALUES (?, ?, ?)`;
            await pool.promise().execute(isTallQuery, [heightId, date, userId]); // Replace userId with the actual user_id
            }
          }

          if (infos.weight) {
            const date = Date.now();
            const weightQuery = `INSERT INTO weight (value, date) VALUES (?, ?)`; // Use '?' for placeholders
            const [weightResult] = await pool.promise().execute(weightQuery, [weight, date])
            
            // Retrieve the auto-generated weight_id
            weightId = weightResult.insertId;

            // Now you can use weightId to insert into the is_tall table
            if (weightId) {
            const weightsQuery = `INSERT INTO weights (weight_id, weight_date, user_id) VALUES (?, ?, ?)`;
            await pool.promise().execute(weightsQuery, [weightId, date, userId]); // Replace userId with the actual user_id
            }
          }

        //   if (infos.allergens) {
        //     const query = `INSERT INTO allergens (allergen_name, user_id) VALUES (?, ?)`; // Use '?' for placeholders
        //     await pool.promise().execute(query, [allergens, date = Date.now])
        //   }
      
          res.sendStatus(201);
        } catch (err) {
          console.error('Failed to create user:', err);
          res.status(500).json({ error: 'Failed to create user' });
        }
    }

    async getInfosByUserId(req, res) {
        try {
            const { userId } = req.params;

            const query = `
            SELECT
                h.size AS height,
                h.date AS height_date,
                w.value AS weight,
                w.date AS weight_date
            FROM
                is_tall h
            LEFT JOIN
                weights w ON h.user_id = w.user_id
            WHERE
                h.user_id = ?;
        `;

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

    async updateUserInfosById(req, res) {
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

    async deleteUserInfosById(req, res) {
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
    
export default new UserInfosController();