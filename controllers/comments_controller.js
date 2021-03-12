const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_workers');

module.exports.create = async function (req, res){
    try {
        // Create comments only when the post exists.
        let post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            // Update the post also if the comment is created
            post.comments.push(comment);
            // Always save after update
            post.save();
            // User should be pre-populated when it's being sent from controller to mailer. 
            comment = await comment.populate('user','name email').execPopulate();
            
            // commenting as mails would be generated through delayed job queues.
            // commentsMailer.newComment(comment);
            // Every time we put into a queue, its called a job.
            let job = queue.create('emails',comment).save(function(err){
                if(err){
                    console.log('Error in sending to the queue',err);
                    return;
                }
                console.log('Job queue enqueued', job.id);
            });

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment : comment
                        // post : post
                    },
                    message : "Comment Created!"
                });
            }
            req.flash('success','Comment Posted!!');
            res.redirect('/');
        }
    }
    catch(err){
        console.log("Error", err);
        req.flash('error',err);
        return;
    }
}

module.exports.destroy = async function (req, res) {
    try {
        // Check whether the comment exists or not
        let comment = await Comment.findById(req.params.id);
        let postId = comment.post;
        let post = await Post.findById({ _id: postId });
        console.log(post.user);
        // Check whether the user is authorised to delete comment
        if (comment.user == req.user.id || post.user == req.user.id) {
            // Find the post id of the comment
            let postId = comment.post;
            comment.remove();
            let post =  Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
            
            if(req.xhr){
                //console.log("executing delete comment controller");
                return res.status(200).json({
                    data:{
                        comment_id : req.params.id
                    },
                    message : "Comment Deleted!"
                });
            }

            req.flash('success',"Comment deleted!");
            return res.redirect('back');
            
        }
        else {
            console.log("not deleting");
            req.flash('error',"Not deleting comment!");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log("Error", err);
        req.flash('error',err);
        return;
    }
}