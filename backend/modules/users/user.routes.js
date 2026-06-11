const express = require('express');
const router = express.Router();
const { getUsers } = require('./user.controller');

// Maps to /api/users/
router.route('/')
  .get(getUsers);

module.exports = router;
