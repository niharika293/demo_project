const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');

module.exports.create = async function (req, res) {
     //Create a post
     //console.log(req.user);
     try {
          let post = await Post.create({
               content: req.body.content,
               user: req.user._id
          });
          // check if the request is an AJAX request
          if(req.xhr){
               // populate the name of the user
               post = await post.populate('user','name').execPopulate();
               return res.status(200).json({
                    data:{
                         post: post
                    },
                    message: "Post created!"
               });
          }
          req.flash('success','Post Published!');
          return res.redirect('back');
     }
     catch (err) {
          console.log("Error", err);
          req.flash('error',err);
          return res.redirect('back');
     }
}

module.exports.destroy = async function (req, res) {
     try {
          // Find whether the post exists in the DB or not.
          let post = await Post.findById(req.params.id);
          //This will check if the post id matches with the user id who's logged in, only then the post will be deleted.
          if (post.user == req.user.id) { //Initially post.user is going to be a string ID 
               
               // If a post is deleted likes present on it as well as on it's comments should get deleted too.

               await Like.deleteMany({likeable: post, onModel: 'Post' });
               await Like.deleteMany({_id : {$in : post.comments}});
 
               // .id means converting the object id into string.
               post.remove();
               await Comment.deleteMany({ post: req.params.id });
               if(req.xhr){
                    
                    return res.status(200).json({
                         data:{
                              post_id: req.params.id
                         },
                         message: "Post Deleted",
                    });
               }

               req.flash('success','Post and associated comments Deleted!!');
               return res.redirect('back');
          }
          else{
               req.flash('error','You cannot delete this post!');
               return res.redirect('back');
           }
     }
     catch (err) {
          console.log("Error", err);
          req.flash('error',err);
          return res.redirect('back');
     }
}