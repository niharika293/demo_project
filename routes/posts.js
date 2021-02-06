const express = require('express');
const router = express.Router();
const postsController = require('../controllers/posts_contoller');
router.post('/create',postsController.create);
module.exports = router;

