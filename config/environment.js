const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

// Define where the logs will be stored.

const logDirectory = path.join(__dirname,'../production_logs');
// Check if the production log already exists, Create a new one othewise.
fs.existsSync(logDirectory)||fs.mkdirSync(logDirectory);
// Naming this way, as the user is accessing the log stream.
// interval : 1d => rotate daily 
const accessLogStream = rfs.createStream('access.log',{
    interval : '1d',
    path : logDirectory
});

const development = {
    name : 'development',
    asset_path : './assets',
    session_cookie_key : 'blah something',
    db : 'codeial-development',
    smtp : {
        service : "gmail",
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'youremail@gmail.com', 
            pass: 'yourpassword'
        }
    },
    google_client_ID :"374632310222-6d8952rjvu8cni5f25aovh3c0624ce30.apps.googleusercontent.com",
    google_client_Secret : "CNwTrJJYdo_cyoYZkfEOPzuS",
    google_call_back_URL : "http://localhost:8000/user/auth/google/callback",
    jwt_secret : 'codeial',
    morgan :{
        mode : 'dev',
        options : {stream : accessLogStream}
    }
}

const production = {
    name : 'production',
    asset_path : process.env.CODEIAL_ASSET_PATH,
    session_cookie_key : process.env.CODEIAL_SESSION_COOKIE_KEY,
    db : process.env.CODEIAL_DB,
    smtp : {
        service : "gmail",
        host : 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.CODEIAL_GMAIL_USERNAME, 
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_ID : process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_Secret : process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_URL : process.env.CODEIAL_GOOGLE_CALL_BACK_URL,
    jwt_secret : process.env.CODEIAL_JWT_SECRET,
    morgan :{
        mode : 'combined',
        options : {stream : accessLogStream}
    }
}

module.exports = eval(process.env.CODEIAL_ENVIRONMENT)==undefined?development:eval(process.env.CODEIAL_ENVIRONMENT);

// module.exports = development;