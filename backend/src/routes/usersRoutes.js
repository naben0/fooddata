import express from 'express';
import UserController from '../controllers/UserController.js';

const router = express.Router();

// User CRUD
router.post('/', UserController.createUser);
router.get('/:userId', UserController.getUserById);
router.put('/:userId', UserController.updateUserById);
router.delete('/:userId', UserController.deleteUserById);

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
