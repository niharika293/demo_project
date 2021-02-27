const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
// this module will help us to extract the JWT from the headers.
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
// We also need to have some options for encryption, decryption => Keys.
// use of options : to control how the token is extracted from the request or verified.
// jwtFromRequest (REQUIRED) Function that accepts a request as the only parameter and returns either the JWT as a string or null.
//  fromAuthHeaderAsBearerToken() creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
// secretOrKey : decryption happens here
let opts = {
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'codeial'
}
// Tell the passport to use JWTStrategy.
// This () will be used to read the data from the JWT Payload.
passport.use(new JWTStrategy(opts,function(jwtPayload,done){
    // Find the user based on the info in Payload.
    // Payload completes the complete user's info.
    User.findById(jwtPayload._id, function(err,user){
        if(err){
            console.log("Error in finding the user from JWT");
            return;
        }
        if(user){
            return done (null,user);
        }
        else{
            return done (null , false);
        }
    });
}));

module.exports = passport;