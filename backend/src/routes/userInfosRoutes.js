import express from 'express';
import UserInfosController from '../controllers/UserInfosController.js';

const router = express.Router();

// Informations of a specific user (height, weight, allergens)
router.post('/:userId', UserInfosController.addUserInfosById);
router.get('/:userId', UserInfosController.getInfosByUserId); 
router.put('/:userId', UserInfosController.updateUserInfosById);
router.delete('/:userId', UserInfosController.deleteUserInfosById);

export default router;
