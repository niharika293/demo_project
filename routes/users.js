const express = require('express');
const router = express.Router();
const passport = require('passport');
const usersController = require('../controllers/users_controllers');
const { route } = require('./posts');
// To make the profile page accessible only when the user is signed in
router.get('/profile/:id',passport.checkAuthentication, usersController.profile);
router.post('/update/:id',passport.checkAuthentication, usersController.update);
router.get('/login', usersController.login);
router.get('/signup', usersController.signup);
router.post('/create', usersController.create);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    { failureRedirect: '/user/login'},
    ), usersController.createSession);
router.get('/sign-out',usersController.destroySession);

// this route will fetch data from google.
// "/auth/google" is given by passport, google will recognise it.
// "google" -> Strategy
// Scope : array of strings, it's the info which we're looking to fetch.
// email is not a part of the profile, you need to seek permissions for it.  
router.get('/auth/google',passport.authenticate('google',{scope : ['profile', 'email']}));

// Google will respond to this URL after fetching, this will recieve the data.

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect : '/user/login'}),usersController.createSession);

router.get('/reset_password',usersController.createToken);
router.post('/reset_password',usersController.checkToken);


module.exports = router;