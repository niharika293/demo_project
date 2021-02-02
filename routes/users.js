const usersController = require('../controllers/users_controllers');
const express = require('express');
const { route } = require('./posts');
const router = express.Router();
router.get('/profile',usersController.profile);
router.get('/login',usersController.login);
router.get('/signup',usersController.signup);
router.post('/create',usersController.create);
module.exports = router;