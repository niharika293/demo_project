const Post = require('../../../models/Post');
const Comment = require('../../../models/Comment');
module.exports.index = async function (req, res) {
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });
    return res.json(200,{
        message : "List Of posts",
        posts : posts
    });

}
module.exports.destroy = async function (req, res) {
    try {
        // Find whether the post exists in the DB or not.
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({ post: req.params.id });
            return res.json(200, {
                message: "Posts and associated comments deleted successfully!"
            });
        }
        else{
            return res.json(401,{
                message : "You cannot delete this post!"
            });
        }
        
    }
    catch (err) {
        console.log("Error", err);
        return res.json(500, {
            message: "Internal server error!"
        });
    }
}