const Post = require('../models/Post');

module.exports.create = function(req,res){
     //Create a post
     Post.create({
          content:req.body.content,
          user:req.user._id
     },function(err,post){
          if(err){
               console.log("Error in creating post");
               return;
          }
          return res.redirect('back');
     });
};