const Comment = require('../models/Comment');
const Post = require('../models/Post');

module.exports.create = function(req,res){
    // Create comments only when the post exists.
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){
                if(err){
                    console.log("Error in creating a comment ");
                    return;
                }
                // Update the post also if the comment is created
                post.comments.push(comment);
                // Always save after update
                post.save();
                res.redirect('/');
            });
        }
    });
}