const express = require('express');
const router = express.Router();
const passport = require('passport');

const postsController = require('../controllers/posts_contoller');
// Putting a check at the URL level to limit accessibility only to the authenticated users 
router.post('/create',passport.checkAuthentication,postsController.create);
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);
module.exports = router;

