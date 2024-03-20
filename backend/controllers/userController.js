const User = require('../models/User');

const getProfile = (req, res) => {
  try {

    const userProfile = {
      displayName: req.user.displayName,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
    };

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAnalytics = (req, res) => {
  try {

    res.json({ message: 'Analytics data will be fetched here' });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
    getProfile,
    getAnalytics
}


