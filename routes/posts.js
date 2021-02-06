const passport = require('passport');
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_contoller');
// Putting a check at the URL level to limit accessibility only to the authenticated users 
router.post('/create',passport.checkAuthentication,postsController.create);
module.exports = router;

