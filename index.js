//Acquiring Express
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();//Creates an Express application. The express() function is a top-level function exported by the express module. 
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); //acquire layouts
const db = require('./config/mongoose'); //acquire the defined mongoose connection
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

// Put Sass Middleware settings before the server starts, so that all the sass files get pre-compiled
// before they are accessed.

app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true, //enables to see the errors if the files fail to compile from scss to css
    outputStyle:'extended', //output : multiple lines
    prefix:'/css' //t will tell the sass middleware that any request file will always be prefixed with <prefix> and this prefix should be ignored.
}));

// reading through post requests
app.use(express.urlencoded());

// tell the app to use cookie parser
app.use(cookieParser());

// tell the app to use static files in assets folder.
app.use(express.static('./assets'));
// make the upload path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));


// tell the app to  use the layouts before the views to render pages accordingly as they're the wrappers for every view. 
app.use(expressLayouts);

// tell the app to extract styles & scripts from sub-pages and put into the layout.
app.set('layout extractStyles',true); //for css files
app.set('layout extractScripts',true); //for js files

//tell the app to use EJS as view-engine.
app.set('view engine','ejs');
app.set('views','./views');

// tell the app to use passport local for authentication
// Mongo store is used to store the session cookie in the DB.
app.use(session({
    name:'codeial',
    secret:'blah something',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:new MongoStore({
        mongooseConnection:db,
        autoRemove:'disabled'
    },function(err){
        console.log(err || 'connect-mongodb setup ok!');
    }
    )
}));
app.use(passport.initialize());
app.use(passport.session());

// Set the current user usage
app.use(passport.setAuthenticatedUser);
// set flash here, since it uses express-session and cookie parser to store the messages.
app.use(flash()); 
app.use(customMware.setFlash);
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