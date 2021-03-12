const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true //without it, the data won't be stored.
    },
    user:{ //to link with user schema
        type:mongoose.Schema.Types.ObjectId,
        ref:'User' //refers to user schema
    },
    // load the comments on the posts
    // include the array of all the ids of the comments in this post schema itself
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'like'
    }]
},{
    timestamps:true
});
const Post = mongoose.model('Post',postSchema);
module.exports = Post;