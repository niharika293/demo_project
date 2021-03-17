const mongoose = require('mongoose');

const friendshipSchema = new mongoose.Schema({
    // specifies from where the friend request has been sent.
    from_user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    // specifies to whom the friend request has been sent.
    to_user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
},{
    timestamps : true
});

const Friendship = mongoose.model('Friendship',friendshipSchema);
module.exports = Friendship;

// Keep an array of friendships in *User* Model, so that access of friendship becomes faster!! 