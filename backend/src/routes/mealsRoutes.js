import express from 'express';
import * as mealsController  from '../controllers/mealsController.js';

const router = express.Router();

// Informations of a specific user (height, weight, allergens)
router.post('/', mealsController.createMeal);
router.get('/:userId', mealsController.getUserMeals);

export default router;
