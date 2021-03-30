// Acquiring mongoose from the library.
const mongoose = require('mongoose');
const env = require('../config/environment');
// Define the connection environment for mongoose
mongoose.connect(`mongodb://localhost/${env.db}`);
// establishing the DB connection
const db = mongoose.connection;
// Checking whether the connection is established or not.
db.on('error',console.error.bind(console,"Error connecting to Mongo DB!"));
db.once('open',function(){
    console.log("Connected to Database :: Mongo DB!");
});
module.exports = db; //to make it usable from our app outside this file.