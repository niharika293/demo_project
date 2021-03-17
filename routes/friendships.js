const express = require('express');
const router = express.Router();

const friendshipsController = require('../controllers/friendships_controller');

router.get('/toggle/:id',friendshipsController.toggleFriendship);

module.exports = router;