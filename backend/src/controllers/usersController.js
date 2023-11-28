import * as userModel from '../models/userModel.js';

// CRUD
export const createUser = async (req, res) => {
  const user = req.body;

  try {
    const result = await userModel.createUser(user);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.getUserById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.userId;
  const userData = req.body;

  try {
    const result = await userModel.updateUser(userId, userData);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await userModel.deleteUser(userId);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
