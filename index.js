//Acquiring Express
const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();//Creates an Express application. The express() function is a top-level function exported by the express module. 
require('./config/view-helpers')(app);
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
const path = require('path');
// Set-up the chat server to be used with socket.io
// Express initializes app to be a function handler that you can supply to an HTTP server.
const chatServer = require('http').Server(app); 
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000, () =>{
    console.log("******Chat server is up & running on port 5000******");
});

// app.on('ready', () => {
//     mainWindow = new BrowserWindow({
//         webPreferences: {
//             nodeIntegration: true
//         }
//     });
// });

// Put Sass Middleware settings before the server starts, so that all the sass files get pre-compiled
// before they are accessed.
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname,env.asset_path,'scss'),
        dest: path.join(__dirname,env.asset_path,'css'),
        // debug:true, //enables to see the errors if the files fail to compile from scss to css
        outputStyle:'extended', //output : multiple lines
        prefix:'/css' //it will tell the sass middleware that any request file will always be prefixed with <prefix> and this prefix should be ignored.
    }));    
}

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// });

// reading through post requests
app.use(express.urlencoded({extended : false}));


// tell the app to use cookie parser
app.use(cookieParser());

// tell the app to use static files in assets folder.

app.use(express.static(env.asset_path));
// app.use(express.static(__dirname + '/public/assets/images'));
// app.use(express.static(__dirname + '/public/assets/js'));

// make the upload path available to the browser
app.use('/uploads',express.static(__dirname+'/uploads'));
// app.use('/images',express.static(__dirname+'/public/assets/images'));

app.use(logger(env.morgan.mode,env.morgan.options));


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
    secret:env.session_cookie_key,
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