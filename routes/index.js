const express = require('express');
//since express is already acquired in index file of app, hence no new instance will be created, 
// it will be taking the already existing  instance from there and launch it here.
const router = express.Router(); //this will be able to handle all the URLs now. 
const homeController = require('../controllers/home_controller');
console.log("Router Started!!");
module.exports = router; //available outside this file now.

//To access the controller from the routes.
router.get('/',homeController.home);