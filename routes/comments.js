const passport = require('passport');
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments_controller');
// Putting a check at the URL level to limit accessibility only to the authenticated users 
router.post('/create',passport.checkAuthentication,commentsController.create);
module.exports = router;

