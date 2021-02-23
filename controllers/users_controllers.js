const User = require('../models/User');
// render the user profile page 
module.exports.profile = function (req, res) {
   // return res.end('<h1>Users Profile </h1>');
   User.findById(req.params.id, function (err, user) {
      return res.render('users', {
         title: "Users at Codeial!",
         profile_user: user
      });
   });
}
module.exports.update = async function (req, res) {
   // The logged in user can update only his profile
   // if(req.user.id == req.params.id){
   //    User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
   //       return res.redirect('back');
   //    });
   // }
   // else{
   //    return res.status(401).send("Unauthorised");
   // }
   if (req.user.id == req.params.id) {
      try {
         let user = await User.findById(req.params.id);
         User.uploadedAvatar(req, res, function (err) {
            if (err) {
               console.log("******Multer Error*******",err);
            }
            // console.log(req.file);
            user.name = req.body.name;
            user.email = req.body.email;
            if(req.file){
               // saving the path of the uploaded file into the avatar field of the user
               user.avatar = User.avatarPath+'/'+req.file.fileName; 
            }
            user.save();
            req.flash('success',"File uploaded successfully!");
            return res.redirect('back');
         });
      }
      catch (err) {
         req.flash('error', err);
         return res.redirect('back');
      }
   }
   else {
      console.log("Error", err);
      req.flash('error', "unauthorized");
      return res.status(401).send("Unauthorized!");
   }
}
// render the user sign-up page 
module.exports.signup = function (req, res) {
   // if the user is already authenticated/logged in, no need for sign-up, redirect to his profile. 
   if (req.isAuthenticated()) {
      return res.redirect('/user/profile');
   }
   return res.render('signup', {
      title: "Codeial - Registration"
   });
}
// render the user login page 
module.exports.login = function (req, res) {
   // if the user is already authenticated/logged in, no need for login again, redirect to his profile. 
   if (req.isAuthenticated()) {
      return res.redirect('/user/profile');
   }
   return res.render('login', {
      title: "Codeial Login"
   });
}
// Get the user details for sign-up.
module.exports.create = function (req, res) {
   if (req.body.password != req.body.confim_password) {
      return (res.redirect('back'));
   } //if the passwords do not match.
   User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
         console.log("Error in finding user for sign-up");
         return;
      }//if the user aleady exists
      if (!user) {
         User.create(req.body, function (err, user) {
            if (err) {
               console.log("Error in creating user for sign-up");
               return;
            }
            return res.redirect('/user/login'); //create user if not exists.
         });
      }
      else {
         return (res.redirect('back')); //if the user exists. 
      }
   })
}
// Sign-In and Create a session for the user.
module.exports.createSession = function (req, res) {
   // console.log("createSession controller called!!");
   // Send flash msgs from the current request being completed to the next page.
   req.flash('success', "Logged In Successfully!!");
   return res.redirect('/');
}
// Sign-out and destroy a session for the user
module.exports.destroySession = function (req, res) {
   req.flash('success', "You have been logged out successfully!!");
   req.logout(); //passport gives this to the request
   return res.redirect('/');
} 