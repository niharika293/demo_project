const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto'); // For random passwords
const User = require('../models/User');
const env = require('../config/environment');

// Tell Passport to use google-oAuth2 Strategy.
// accessToken : After authentication, Google generates an access token & gives it back to us.
// refreshToken : If the access token expires, refreshToken is used, without asking the user to login again.
// profile : contains the user's info.
// done : takes the callback from the ().
passport.use(new googleStrategy({
    clientID : env.google_client_ID,
    clientSecret : env.google_client_Secret,
    callbackURL : env.google_call_back_URL
},function(accessToken,refreshToken,profile,done){
    // Find the user with the email in the DB.
    console.log("printing for profile email",profile.emails);
    console.log("test for 0",profile.emails[0]);

    User.findOne({
        email : profile.emails[0].value
    }).exec(function(err,user){
        if(err){
            console.log("Error in Google-Strategy-Passport",err);
            return;
        }
        console.log(profile);
        // if found, set the user as req.user
        // req.user means to sign-in that user
        if(user){
            return done(null,user);
        }
        else{
            // if not found, Create the user & set it as req.user.
            User.create({
                name : profile.displayName,
                email : profile.emails[0].value,
                password : crypto.randomBytes(20).toString('hex')
            },function(err,user){
                if(err){
                    console.log("Error in Creating user",err);
                    return;
                }
                return done(null,user);
            }); 
        }
    });

}));

module.exports = passport;