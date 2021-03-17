const express = require('express');
//since express is already acquired in index file of app, hence no new instance will be created, 
// it will be taking the already existing  instance from there and launch it here.
const router = express.Router(); //this will be able to handle all the URLs now. 
const homeController = require('../controllers/home_controller');
console.log("Router Started!!");

//To access the controller from the routes.
router.get('/',homeController.home);
router.use('/user',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/api',require('./api'));
router.use('/likes',require('./likes'));
router.use('/friends',require('./friendships'));
module.exports = router; //available outside this file now.