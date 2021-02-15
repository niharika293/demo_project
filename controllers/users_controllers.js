const User = require('../models/User');
// render the user profile page 
module.exports.profile = function(req,res){
   // return res.end('<h1>Users Profile </h1>');
   User.findById(req.params.id,function(err,user){
      return res.render('users',{
         title:"Users at Codeial!",
         profile_user: user
      });
   });
}
// render the user sign-up page 
module.exports.signup = function(req,res){
   // if the user is already authenticated/logged in, no need for sign-up, redirect to his profile. 
   if(req.isAuthenticated()){
      return res.redirect('/user/profile');
   }
   return res.render('signup',{
       title: "Codeial - Registration"
   });
}
// render the user login page 
module.exports.login = function(req, res){
    // if the user is already authenticated/logged in, no need for login again, redirect to his profile. 
    if(req.isAuthenticated()){
      return res.redirect('/user/profile');
   }
   return res.render('login',{
       title:"Codeial Login"
   });
}
// Get the user details for sign-up.
module.exports.create = function(req,res){
   if(req.body.password != req.body.confim_password){
      return(res.redirect('back'));
   } //if the passwords do not match.
   User.findOne({email : req.body.email}, function(err,user){
      if(err){
         console.log("Error in finding user for sign-up");
         return;
      }//if the user aleady exists
      if(!user){
         User.create(req.body,function(err,user){
            if(err){
               console.log("Error in creating user for sign-up");
               return;
            }
            return res.redirect('/user/login'); //create user if not exists.
         });
      }
      else{
         return(res.redirect('back')); //if the user exists. 
      }
   })
}
// Sign-In and Create a session for the user.
module.exports.createSession = function(req,res){
   console.log("createSession controller called!!");
   return res.redirect('/');
}
// Sign-out and destroy a session for the user
module.exports.destroySession = function(req,res){
   req.logout(); //passport gives this to the request
   return res.redirect('/');
} 