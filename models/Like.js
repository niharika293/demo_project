const mongoose = require('mongoose');
const likeSchema = new mongoose.Schema({
    // Like belongs to the user
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // type : post/comment
    likeable : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        // refPath : tells dynamic reference, fro this we're going to refer a path to some
        // other field, & that field will define on which object the like has been placed.
        refPath : 'onModel'
    },
    onModel : {
        type : String,
        required : true,
        enum : ['Post', 'Comment']
    }
},{
    timestamps : true
});

// Tell Mongoose that it is a Model. 
const like = mongoose.model('like',likeSchema);
module.exports = like;
// Tell the models - Posts & Comments that they're going to have array of *Likes* as well! 