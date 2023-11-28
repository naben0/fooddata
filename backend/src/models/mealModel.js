import pool from '../config/database.js';

export const createMeal = async (userId, mealName, ingredients) => {
  const connection = await pool.promise().getConnection();

  try {
    // Insert into 'meals' table
    
    const [mealResult] = await connection.query(
      'INSERT INTO meals (meal_name) VALUES (?)',
      [mealName]
    );

    const mealId = mealResult.insertId;

    // Insert into 'users_meals' table
    await connection.query(
      'INSERT INTO users_meals (meal_id, user_id, meal_date) VALUES (?, ?, NOW())',
      [mealId, userId]
    );
    console.log(ingredients)
    // Insert into 'has_ingredient' table for each ingredient
    for (const { ingredient_id, quantity } of ingredients) {
      await connection.query(
        'INSERT INTO has_ingredient (meal_id, ingredient_id, ingredient_quantity) VALUES (?, ?, ?)',
        [mealId, ingredient_id, quantity]
      );
    }

    return { success: true, message: 'Meal created successfully' };
  } catch (error) {
    console.error('Error creating meal:', error);
    return { success: false, message: 'Failed to create meal' };
  } finally {
    connection.release();
  }
};

export const getUserMeals = async (userId) => {
    const connection = await pool.promise().getConnection();

    try {
        const [rows] = await connection.query(
            `
            SELECT 
                meals.meal_id, 
                meals.meal_name,
                has_ingredient.ingredient_id,
                ingredients.ingredient_name,
                has_ingredient.ingredient_quantity
            FROM 
                users_meals
            INNER JOIN 
                meals ON users_meals.meal_id = meals.meal_id
            LEFT JOIN 
                has_ingredient ON meals.meal_id = has_ingredient.meal_id
            LEFT JOIN 
                ingredients ON has_ingredient.ingredient_id = ingredients.ingredient_id
            WHERE 
                users_meals.user_id = ?
            `,
            [userId]
        );

        const meals = {};
        rows.forEach(row => {
            const mealId = row.meal_id;
            if (!meals[mealId]) {
                meals[mealId] = {
                    meal_id: mealId,
                    meal_name: row.meal_name,
                    ingredients: []
                };
            }

            if (row.ingredient_id) {
                meals[mealId].ingredients.push({
                    ingredient_id: row.ingredient_id,
                    ingredient_name: row.ingredient_name,
                    ingredient_quantity: row.ingredient_quantity
                });
            }
        });

        return { success: true, data: Object.values(meals) };
    } catch (error) {
        console.error('Error retrieving user meals:', error);
        return { success: false, message: 'Failed to retrieve user meals' };
    } finally {
        connection.release();
    }
};
