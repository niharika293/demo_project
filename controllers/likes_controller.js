const Like = require('../models/Like');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
// const like = require('../models/Like');

// toggleLink action acts as a toggle switch, it checks if there's a like present, & if pressed, it'll 
// decrease the count of like & remove. 
// If like is not present, then it'll create the like & save. 

module.exports.toggleLink = async function(req,res){
    try{
        // 1. URL (e.g for Post): likes/toggle/?id=abcde&type=Post
        let likeable;
        let deleted = false; //beacuse only then the user will be able to add a like, & reflect the increment in the DB. 
        // 2. Finding Likeable
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }
        else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }
        // 3. Check if the like already exists.
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user : req.user._id
        });
        // 3.1 if existingLike is present, then delete will be performed upon the toggling action.
        // Delete / Pull from the current Post / Comment. 
        // Save, Delete from the likes DB.       
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }
        // 3.2 if like doesn't exist, make one.
        else{
            let newLike = await Like.create({
                user : req.user._id,
                likeable : req.query.id,
                onModel : req.query.type
            });
            // Now, Push the newly created likes in Posts/comments
            likeable.likes.push(newLike._id);
            likeable.save();
        }
        return res.json(200,{
            message : "Request succesful!",
            data : {
                deleted : deleted
            }
        });
    }
    catch(err){
        console.log(err);
        return res.json(500,{
            message : "Internal Server Error!"
        });
    }
}