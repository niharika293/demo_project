const Comment = require('../models/Comment');
const Post = require('../models/Post');

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
            if(req.xhr){
                comment = await comment.populate('user','name').execPopulate();
                return res.status(200).json({
                    data:{
                        comment : comment,
                        post : post
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