//Acquiring Express
const express = require('express');
const app = express();//Creates an Express application. The express() function is a top-level function exported by the express module. 
const port = 8000;

//use express router.
app.use('/',require('./routes')); //by default it takes index.js from routes. 

//check connectivity with the server
app.listen(port,function(err){
    if(err){
        //using interpolation, no need to use '+'/',' to join 2 strings
        console.log(`Error while running the server :${err}`);
    }
    console.log(`Server is up and running on Port: ${port}`);
});