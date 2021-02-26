const express = require('express');
const router = express.Router(); //this will be able to handle all the URLs now. 
router.use('/v1',require('./v1'));
router.use('/v2',require('./v2'));

module.exports = router; //available outside this file now.
