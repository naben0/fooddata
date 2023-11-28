import * as userModel from '../models/userModel.js';

export const getUserData = async (req, res) => {
  const userId = req.params.userId;

  try {
    const username = await userModel.getUsernameById(userId);
    const heightData = await userModel.getHeightDataByUserId(userId);
    const weightData = await userModel.getWeightDataByUserId(userId);
    const allergenData = await userModel.getAllergenDataByUserId(userId);

    const userData = [
      { username: username },
      { heightData: heightData },
      { weightData: weightData },
      { allergenData: allergenData }
    ];

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getUserWeight = async (req, res) => {
  const userId = req.params.userId;

  try {
    const weightData = await userModel.getWeightDataByUserId(userId);

    const userData = [
      { weightData: weightData },
    ];

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getUserAllergens = async (req, res) => {
  const userId = req.params.userId;

  try {
    const allergenData = await userModel.getAllergenDataByUserId(userId);

    const userData = [
      { allergenData: allergenData },
    ];

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user info:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};