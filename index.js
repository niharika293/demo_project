//Acquiring Express
const express = require('express');
const app = express();//Creates an Express application. The express() function is a top-level function exported by the express module. 
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); //acquire layouts
const db = require('./config/mongoose'); //acquire the defined mongoose connection

// tell the app to use static files in assets folder.
app.use(express.static('./assets'));

// tell the app to  use the layouts before the views to render pages accordingly as they're the wrappers for every view. 
app.use(expressLayouts);

// tell the app to extract styles & scripts from sub-pages and put into the layout.
app.set('layout extractStyles',true); //for css files
app.set('layout extractScripts',true); //for js files

//tell the app to use EJS as view-engine.
app.set('view engine','ejs');
app.set('views','./views');

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