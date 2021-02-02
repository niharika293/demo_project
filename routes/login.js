const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');
router.get('/',loginController.login);
module.exports = router;