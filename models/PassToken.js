// Acquire mongoose library
const mongoose = require('mongoose');
const path = require('path');

const resetPassTokenSchema = new mongoose.Schema({
    accessToken:{
        type:String
    },
    // Access Token belongs to user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    isValid:{
        type:Boolean,
        default : true
    }
},{
    timestamps:true
});
const resetPassToken = mongoose.model('resetPassToken',resetPassTokenSchema);
module.exports = resetPassToken;