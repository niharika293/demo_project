// Import passport and passport strategy
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/User');

// Tell Passport to use local strategy. 
// Authentication using passport. 
passport.use(new localStrategy({
    usernameField : 'email'
},
function(email,password,done){
    // Find a user and establish the identity
    User.findOne({email:email},function(err,user){
        if(err){
            console.log("Error in finding user --> Passport");
            return done(err);
        }
        if(!user || user.password!=password){
            console.log("Invalid Username / Password ");
            return done(null,false);
        }
        return done(null,user);
    });
}
));
// Serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
     done (null,user.id);
});
// De-serializing the user from the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error in finding user --> Passport");
            return done(err);
        }
        return done(null,user);
    });
});

// Check if the user is authenticated.
passport.checkAuthentication = function(req, res, next){
    // If the user is signed-in then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    // if the user is not signed-in
    return res.redirect('/user/login');
}

// Set the user for the views
passport.setAuthenticatedUser = function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current signed-in user from the session cookie and hence sending this to the locals for the views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;