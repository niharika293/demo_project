const usersController = require('../controllers/users_controllers');
const express = require('express');
const router = express.Router();
router.get('/profile',usersController.profile);
module.exports = router;