import * as mealModel from '../models/mealModel.js';

// CRUD
export const createMeal = async (req, res) => {
    const userId = req.body.user_id;
    const mealName = req.body.meal_name;
    const ingredients = req.body.ingredients;
  
    try {
      const result = await mealModel.createMeal(userId, mealName, ingredients);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      console.error('Error creating meal:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  export const getUserMeals = async (req, res) => {
    const userId = req.params.userId;
  
    try {
        const result = await mealModel.getUserMeals(userId);
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Error retrieving user meals:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };