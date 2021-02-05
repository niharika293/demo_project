const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controllers');
const { route } = require('./posts');
// To make the profile page accessible only when the user is signed in
router.get('/profile',passport.checkAuthentication, usersController.profile);
router.get('/login', usersController.login);
router.get('/signup', usersController.signup);
router.post('/create', usersController.create);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/user/login'},
    ), usersController.createSession);
router.get('/sign-out',usersController.destroySession);

module.exports = router;