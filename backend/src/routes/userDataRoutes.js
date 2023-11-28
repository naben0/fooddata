import express from 'express';
import * as userDataController  from '../controllers/userDataController.js';

const router = express.Router();

// Informations of a specific user (height, weight, allergens)
router.get('/:userId', userDataController.getUserData);
router.get('/weight_data/:userId', userDataController.getUserWeight);
router.get('/allergens/:userId', userDataController.getUserAllergens);

export default router;
