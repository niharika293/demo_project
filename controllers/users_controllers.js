const User = require('../models/User');
// render the user profile page 
module.exports.profile = function(req,res){
   // return res.end('<h1>Users Profile </h1>');
   return res.render('users',{
      title:"Users at Codeial!"
   });
}
// render the user sign-up page 
module.exports.signup = function(req,res){
   res.render('signup',{
       title: "Codeial - Registration"
   });
}
// render the user login page 
module.exports.login = function(req, res){
   res.render('login',{
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
   
}