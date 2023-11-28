import express from 'express';
import * as usersController from '../controllers/usersController.js';

const router = express.Router();

//CRUD
router.post('/', usersController.createUser);
router.get('/:userId', usersController.getUserById);
router.put('/:userId', usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

// // Planning of the user (meals)
// router.post('/:user_id/:meal_id', addMeal);
// router.get('/:user_id', getMeals);
// router.put('/:user_id/:meal_id', updateMealById);
// router.delete('/:user_id/:meal_id', deleteMealById);

// // User recipes
// router.post('/:user_id/:recipe_id', addRecipe);
// router.get('/:user_id', getRecipes);
// router.put('/:user_id/:recipe_id', updateRecipeById);
// router.delete('/:user_id/:recipe_id', deleteRecipeById);

// // Calculate food intake
// router.get('/:meal_id', getFoodIntake);



export default router;
