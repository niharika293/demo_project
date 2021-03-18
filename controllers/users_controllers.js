const User = require('../models/User');
const ResetPassToken = require('../models/PassToken');
const Friendship = require('../models/Friendship');
const crypto = require('crypto'); // For random passwords
const fs = require('fs');
const path = require('path');

// render the user profile page 
// module.exports.profile = function (req, res) {
//    // return res.end('<h1>Users Profile </h1>');
//    // Find the friendship of the user with the user whose profile is getting opened.
//    // let existingFriendship;
//    // existingFriendship = Friendship.find({from_user : req.user.id, to_user : req.params.id},
//    //    function(err,friendship){
//    //       if(err){
//    //          console.log("Error in finding the friendship ", err);
//    //          return;
//    //       }
//    //       console.log("checking friensdhip ",friendship);
//    //    });
//    // console.log("exising friendship", existingFriendship);
//    let are_friends = false;

//    Friendship.findOne({
//        $or: [{ from_user: req.user._id, to_user: req.params.id },
//        { from_user: req.params.id, to_user: req.user._id }]
//    }, function (error, friendship)
//    {
//        if (error)
//        {
//            console.log('There was an error in finding the friendship', error);
//            return;
//        }
//        if (friendship)
//        {
//           console.log(friendship,"Users Friend");
//            are_friends = true;
//        }
//    });
//    User.findById(req.params.id, function (err, user) {
//       return res.render('users', {
//          title: "Users at Codeial!",
//          profile_user: user,
//          are_friends : are_friends
//       });
//    });

// }
module.exports.profile =async function (req, res) {
   try {
       let user = await User.findById(req.params.id); 
       let from_id = req.user._id;
       let to_id = req.params.id;
       let are_friends = false;
       Friendship.findOne({
           $or: [{ from_user: from_id, to_user: to_id },
           { from_user: to_id, to_user: from_id }]
       }, function (error, friendship)
       {
         console.log("checking from users_controller inside () friendship",friendship);
           if (error)
           {
               console.log('There was an error in finding the friendship', error);
               return;
           }
           if (friendship)
           {
               are_friends = true;
           }
          console.log("checking from users_controller friendship",friendship);
       
         return res.render('users.ejs', {
           title: 'Codeial | Users',
           profile_user:user,
           are_friends: are_friends
       });
   });
   } catch (error) {
       console.log('error in finding user in profile user'); 
       return res.redirect('back');
   }
   
};
module.exports.update = async function (req, res) {
   // The logged in user can update only his profile
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
               //console.log(req.file);
               // if the user has aleady uploaded an avatar before, delete the old avatars. 
               if(user.avatar){
                  fs.unlinkSync(path.join(__dirname,'..',user.avatar));
               }
               user.avatar = User.avatarPath + '/' + req.file.filename; 
            }
            user.save();
            // req.flash('success',"File uploaded successfully!");
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

// Creates the access token
module.exports.createToken = async function(req,res){
   if (req.user)//user should not be logged in before accessing this page or using this action
    {
        return res.redirect('back');
    }
   let accessTokenString = await crypto.randomBytes(40).toString('hex');
   
   // find the user whose email is found in request,
   // whose password needs to be changed.

   try
   {
      var user = await User.findOne({ email: req.body.email });
      /* this is kept as var so that the next try written below identifies the user variable */
   }
   catch (error)
   {
       if (error)
       {
           console.log('There was an error in finding the user whose email is provided in the reset password form!', error);
           return;
       }
   }
   /* generating token for the particular user whose email is provided for resetting password */
   try
   {
       let token = await ResetPassToken.create(
           {
               isValid: true,
               accessToken: accessTokenString,
               user: user
           }
       );
       token = await token.populate('user', 'email').execPopulate();
       return res.render('forgot_password',{
         accessToken : accessTokenString,
         title : 'Codeial | Reset Password'
      });
   }
   catch (error)
   {
       console.log('There was a problem in creating a token to reset users password!', error);
       return;
   }
}
// Check the token for its validity
module.exports.checkToken = async function(req,res){
   if (req.user)//user should not be logged in before accessing this page or using this action
    {
        return res.redirect('back');
    }
    let token_in_link = req.query.accessToken;
    try
    {
        let token = await ResetPassToken.findOne({ accessToken: token_in_link });
        if (!token.isValid)
        {
            return res.redirect('back');
        }
      //   if token is valid, change passwod in DB, update isValid to false.
   let token_in_body = req.body.accessToken;
   if(req.body.Choose_password != req.body.Confirm_password){
      req.flash('Error',"Passwords do not match, Try again!");
      return(res.redirect('back'));
   }
   if (req.body.Choose_password == "")
    {
        req.flash('error', 'Please enter a non empty password in both the fields!');
        return res.redirect('back');
    }

    /* get the token, get user.id from the token,
      find (and update) the user with the given userid on the Users model,
      mark the is_valid in the token as false.*/
      ResetPassToken.findOneAndUpdate({ accessToken: req.body.accessToken }, 
         { $set: { isValid: false } }, function (error, token)
      {
          console.log("printing token",token);
          console.log(`Printing email : ${req.body.email}`);
          if (error)
          {
              console.log('Error in finding the token with given access_token string!', error);
              return;
          }
          if (!token.isValid)
          {
              return res.redirect('back');
          }
          User.findOneAndUpdate({email : req.body.email}, { $set: { password: req.body.Choose_password} }, function (error, user)
          {
              if (error)
              {
                  console.log('Error in finding the user with the provided token!',error);
                  return;
              }
              console.log("Printing new password",user.password,"Checking token validity" ,token.isValid);
            //   console.log(user.password, token.isValid);
              return res.redirect('/user/login');
          });
      });
   }
    catch (error)
    {
        if (error)
        {
            console.log('Unable to find the given token in the tokens model!',error);
            return;
        }
    }

}

// Update the password in DB if the form is successfully submitted. 
// module.exports.changePassword = function(req,res){
//    // this.createToken();
//    // /this.checkToken();
//    if (req.user)//user should not be logged in before accessing this page or using this action
//     {
//         return res.redirect('back');
//     }
//    let token_in_link = req.body.access_token;
//    if(req.body.inp_pw != req.body.inp_cnf_pw){
//       req.flash('Error',"Passwords do not match, Try again!");
//       return(res.redirect('back'));
//    }
//    if (req.body.inp_pw == "")
//     {
//         req.flash('error', 'Please enter a non empty password in both the fields!');
//         return res.redirect('back');
//     }
//     /* get the token, get user.id from the token,
//       find (and update) the user with the given userid on the Users model,
//       mark the is_valid in the token as false.*/
//       ResetPassToken.findOneAndUpdate({ accessToken: token_in_link }, { $set: { isValid: false } }, function (error, token)
//       {
//           console.log(token);
//           if (error)
//           {
//               console.log('Error in finding the token with given access_token string!', error);
//               return;
//           }
//           if (!token.isValid)
//           {
//               return res.redirect('back');
//           }
//           User.findByIdAndUpdate(token.user, { $set: { password: req.body.inp_pw } }, function (error, user)
//           {
//               if (error)
//               {
//                   console.log('Error in finding the user with the provided token!');
//                   return;
//               }
//               console.log(user.password, token.isValid);
//               return res.redirect('/user/sign_In');
//           });
//       });
//   }
   

   // if both paswords match, update the password in user schema.
   // let user  = await User.findByIdAndUpdate(
   // {email : req.body.email},
   // {password : req.body.inp_pw}, function(err,user){      
   //    if (err) {
   //       console.log("Error in finding user for changing password",err);
   //       return;
   //    }
   // });
   // // After updating the pasword, reset the token. 
   // let tokenID = await ResetPassToken.findOneAndUpdate(
   //    {user : user}, 
   //    { "$set" : { accessToken : accessToken, isValid : false}}, 
   //    function(err,resetToken){      
   //       if (err) {
   //          console.log("Error in finding user to be reset for changing password in token schema",err);
   //          return;
   //       }
   //       return res.render('forgot_password',{
   //          accessToken : accessToken
   //       });
   //    });
   // }
