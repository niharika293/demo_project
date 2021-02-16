const Post = require('../models/Post');
const Comment = require('../models/Comment');

module.exports.create = async function (req, res) {
     //Create a post
     //console.log(req.user);
     try {
          await Post.create({
               content: req.body.content,
               user: req.user._id
          });
          return res.redirect('back');
     }
     catch (err) {
          console.log("Error", err);
          return;
     }
}

module.exports.destroy = async function (req, res) {
     try {
          // Find whether the post exists in the DB or not.
          let post = await Post.findById(req.params.id);
          //This will check if the post id matches with the user id who's logged in, only then the post will be deleted.
          if (post.user == req.user.id) { //Initially post.user is going to be a string ID 
               // .id means converting the object id into string.
               post.remove();
               await Comment.deleteMany({ post: req.params.id });
               return res.redirect('back');
          }
          else{
               return res.redirect('back');
           }
     }
     catch (err) {
          console.log("Error", err);
          return;
     }
}