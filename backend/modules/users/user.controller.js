const User = require('./user.model');

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ 
      status: 'success', 
      count: users.length,
      data: users 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers
};
