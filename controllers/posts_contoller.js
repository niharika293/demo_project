const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports.create = function(req,res){
     //Create a post
     //console.log(req.user);
     Post.create({
          content: req.body.content,
          user: req.user._id
     },function(err,post){
          if(err){
               console.log("Error in creating post");
               return;
          }
          return res.redirect('back');
     });
}

module.exports.destroy = function(req,res){
     // Find whether the post exists in the DB or not.
     Post.findById(req.params.id,function(err,post){
          //This will check if the post id matches with the user id who's logged in, only then the post will be deleted.
          if(post.user == req.user.id){ //Initially post.user is going to be a string ID 
               // .id means converting the object id into string.
               post.remove();
               Comment.deleteMany({post:req.params.id},function(err){
                    return res.redirect('back');
               });
          }
          else{
               return res.redirect('back');
          }
     })
}